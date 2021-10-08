import { createMachine, send } from "xstate";
import { assign } from "@xstate/immer";
import { httpClient } from "utils/httpClient";
import { pure } from "xstate/lib/actions";

export type Topic = {
  id: number | string;
  prompt: string;
  labels?: Record<number, string>;
  next?: Array<Partial<Topic>>;
  required?: boolean;
  root?: boolean;
  videoURL?: string;
  helpText?: string;
  type?: "idle" | "confused" | "greeting" | "goodbye" | "interaction";
};

type SelphWizardContext = {
  selph: Partial<{
    id: number;
    name: string;
    description: string;
    user: number;
  }>;
  topics: Array<Topic>;
  imprints: Record<number, Record<any, any>>;
  createdImprints: Record<number, Record<any, any>>;
  history: Array<string | number>;
};

type CreateSelphInput = {
  name: string;
  description: string;
  userId: number;
};

const createSelph = ({ name, description, userId }: CreateSelphInput) => {
  return httpClient.post("/selph", { name, description, user: userId });
};

const createImprint = ({ blob, type, prompt, selphId }) => {
  const formData = new FormData();

  const blobExt = !!blob["ext"] ? blob["ext"] : "webm";

  formData.append("sequence", blob, `imprint.${blobExt}`);
  formData.append("selphId", selphId);
  formData.append("type", type.toUpperCase());
  formData.append("prompt", prompt);

  return httpClient.post("/imprint", formData);
};

const updateImprint = ({ blob, imprintId }) => {
  const formData = new FormData();
  const blobExt = !!blob["ext"] ? blob["ext"] : "webm";

  formData.append("sequence", blob, `imprint.${blobExt}`);

  return httpClient.patch(`/imprint/${imprintId}`, formData);
};

export const baseImprints: Topic[] = [
  {
    id: "idle",
    prompt: "Your Idle Imprint",
    required: true,
    next: [{ id: "confused" }],
    helpText:
      "Every selph requires an idle imprint. Record or upload a video of you looking at the camera.",
    type: "idle",
  },
  {
    id: "confused",
    prompt: "Your Confused Imprint",
    required: true,
    next: [{ id: "hello" }],
    type: "confused",
    helpText: `All selphs also require a confused imprint. When we can't find an appropriate 
            response to a question the recorded or uploaded response will be sent.`,
  },
  {
    id: "hello",
    prompt: "Your Hello Imprint",
    required: true,
    next: [{ id: "goodbye" }],
    type: "greeting",
    helpText: `Record or upload a video of you saying, 'Hi' or 'Hello', or something similar.`,
  },
  {
    id: "goodbye",
    prompt: "Your Goodbye Imprint",
    required: true,
    next: [],
    type: "goodbye",
    helpText: `Record or upload a video of you saying, 'Goodbye' or 'See you later', or something similar.`,
  },
];

export const selphWizardMachine = createMachine<SelphWizardContext>(
  {
    id: "treeMachine",
    initial: "define",
    context: {
      topics: [...baseImprints],
      imprints: {},
      selph: {},
      createdImprints: {},
      history: [],
    },
    states: {
      loading: {
        invoke: {
          id: "topicsLoader",
          target: "define",
          src: (context, event) => {
            return httpClient.get("/topics");
          },
          onDone: {
            target: "define",
            actions: assign((ctx, event) => {
              // alert(JSON.stringify({ invokedData: event.data }));
              const fetchedTopics = event.data?.data;

              const lastBaseImprint = {
                ...baseImprints[baseImprints.length - 1],
                next: [fetchedTopics.find((topic: Topic) => !!topic.root)],
              };
              const modifiedBaseImprints = [
                ...baseImprints.slice(0, -1),
                lastBaseImprint,
              ];
              const topics = [...modifiedBaseImprints, ...fetchedTopics];
              ctx.topics = topics;
            }),
          },
          onError: {
            target: "error",
          },
        },
      },
      define: {
        on: {
          SET_SELPH: {
            target: "active",
            actions: assign((ctx, event: any) => {
              ctx.selph = event.selph;
            }),
          },
        },
      },
      createSelph: {
        invoke: {
          src: (ctx) =>
            createSelph({
              name: ctx.selph.name,
              description: ctx.selph.description,
              userId: ctx.selph.user,
            }),
          onDone: {
            target: "active",
            actions: assign((ctx: any, { data: selph }) => {
              ctx.selph.id = selph.data.id;
            }),
          },
          onError: {
            target: "error",
          },
        },
      },
      createImprint: {
        invoke: {
          id: "createImprint",
          src: (ctx: any, event: any) => {
            const prevTopicId = ctx.history[ctx.history.length - 2];
            const imprint = ctx.imprints?.[prevTopicId];
            const prevTopic = ctx.topics.find(
              (topic: Topic) => topic.id === prevTopicId
            );

            const blob = new Blob(imprint?.chunks, {
              type: imprint.chunks?.[0]?.type || "video/webm",
            });

            if (imprint?.chunks[0]?.ext) {
              Object.assign(blob, { ext: imprint.chunks[0].ext });
            }

            console.log({ createImprintBlob: blob });

            return createImprint({
              blob,
              selphId: ctx.selph.id,
              type: prevTopic?.type,
              prompt: prevTopic?.prompt,
            });
          },
          onDone: {
            target: "active",
            actions: assign((ctx, { data: imprint }) => {
              const prevTopicId = ctx.history[ctx.history.length - 2];
              ctx.createdImprints[prevTopicId] = imprint.data;
            }),
          },
          onError: {
            target: "error",
          },
        },
      },
      createLastImprint: {
        invoke: {
          id: "createLastImprint",
          src: (ctx: any) => {
            const topicId = ctx.history[ctx.history.length - 1];
            const imprint = ctx.imprints?.[topicId];
            const topic = ctx.topics.find(
              (topic: Topic) => topic.id === topicId
            );

            const blob = new Blob(imprint?.chunks, {
              type: imprint.chunks?.[0]?.type || "video/webm",
            });

            if (imprint?.chunks[0]?.ext) {
              Object.assign(blob, { ext: imprint.chunks[0].ext });
            }

            return createImprint({
              blob,
              selphId: ctx.selph.id,
              type: topic?.type || "interaction",
              prompt: topic?.prompt,
            });
          },
          onDone: {
            target: "finish",
            actions: assign((ctx, { data: imprint }) => {
              const topicId = ctx.history[ctx.history.length - 1];
              ctx.createdImprints[topicId] = imprint.data;
            }),
          },
          onError: {
            target: "error",
          },
        },
      },
      updateImprint: {
        invoke: {
          id: "updateImprint",
          src: (ctx: any) => {
            const prevTopicId = ctx.history[ctx.history.length - 2];
            const imprint = ctx.imprints?.[prevTopicId];
            const prevTopic = ctx.topics.find(
              (topic: Topic) => topic.id === prevTopicId
            );

            const blob = new Blob(imprint?.chunks, {
              type: imprint.chunks?.[0]?.type || "video/webm",
            });

            if (imprint?.chunks[0]?.ext) {
              Object.assign(blob, { ext: imprint.chunks[0].ext });
            }

            return updateImprint({
              imprintId: ctx.createdImprints[prevTopicId]?.id,
              blob,
            });
          },
          onDone: {
            target: "active",
            actions: assign((ctx, { data: imprint }) => {
              const prevTopicId = ctx.history[ctx.history.length - 2];
              ctx.createdImprints[prevTopicId] = imprint.data;
            }),
          },
          onError: {
            target: "error",
          },
        },
      },
      active: {
        entry: send("CREATE_SELPH"),
        on: {
          ERROR: {
            target: "error",
          },
          CREATE_SELPH: {
            target: "createSelph",
            cond: (ctx) => !ctx.selph.id,
          },
          CREATE_IMPRINT: {
            target: "createImprint",
          },
          UPDATE_IMPRINT: {
            target: "updateImprint",
          },
          NEXT: {
            actions: [
              assign((ctx, event: any) => {
                ctx.history = [...ctx.history, event.topicId];
              }),
              pure((ctx, event) => {
                console.log(event);
                const prevTopicId = ctx.history[ctx.history.length - 2];
                const imprint = ctx.imprints?.[prevTopicId];
                const isImprintCreated = !!ctx.createdImprints[prevTopicId];
                if (ctx.selph?.id && imprint?.previewURL && !isImprintCreated) {
                  return send("CREATE_IMPRINT");
                }

                if (!!ctx.createdImprints[prevTopicId] && ctx.selph.id) {
                  return send("UPDATE_IMPRINT");
                }
              }),
            ],
            cond: "isValidTopic",
          },
          PREV: {
            actions: [
              assign((ctx) => {
                ctx.history = ctx.history = ctx.history.slice(0, -1);
              }),
            ],
          },
          FINISH: {
            target: "createLastImprint",
          },
          SET_CREATED_IMPRINT: {
            actions: assign((ctx, event: any) => {
              ctx.createdImprints[event.topicId] = event.imprint;
            }),
          },
          SET_CHUNKS: {
            actions: [
              assign((ctx, event: any) => {
                // when we add new chunks we store them in the context
                const newImprints = {
                  ...ctx.imprints,
                  [event.topicId]: {
                    ...ctx.imprints[event.topicId],
                    chunks: event.chunks,
                  },
                };
                // create preview url from chunks
                // but clean up first
                if (ctx.imprints?.[event.topicId]?.previewURL) {
                  URL.revokeObjectURL(
                    ctx.imprints?.[event.topicId]?.previewURL
                  );
                }
                const blob = new Blob(event.chunks, {
                  type: event.chunks?.[0]?.type || "video/webm",
                });

                if (event?.chunks[0]?.ext) {
                  Object.assign(blob, { ext: event.chunks[0].ext });
                }

                const url = URL.createObjectURL(blob);
                ctx.imprints = newImprints;
                ctx.imprints[event.topicId].previewURL = url;
              }),
            ],
          },
        },
      },
      finish: {
        type: "final",
      },
      error: {
        type: "final",
      },
    },
  },
  {
    guards: {
      isValidTopic: (ctx, event: any) => {
        const isTopicValid = !!ctx.topics.find(
          (topic: any) => topic.id === event.topicId
        );

        if (ctx.history.length < 1) return isTopicValid;

        if (ctx.history.length >= 1) {
          const currentTopicId = ctx.history[ctx.history.length - 1];
          const currentTopic = ctx.topics.find(
            (topic: any) => topic.id === currentTopicId
          );
          return (
            isTopicValid &&
            currentTopic.next
              .map((topic: Topic) => topic.id)
              .includes(event.topicId)
          );
        }

        return isTopicValid;
      },
    },
  }
);
