import React from "react";
import Highlight, { defaultProps, Language } from "prism-react-renderer";
import theme from "prism-react-renderer/themes/dracula";
import { styled } from "bumbag";

export const Pre = styled.pre`
  text-align: left;
  margin: 1em 0;
  padding: 0.5em;
  height: 100px;
  white-space: pre-wrap;
  overflow: scroll;

  & .token-line {
    line-height: 1.5em;
    height: 1.5em;
  }
`;
interface CodeBlockProps {
  language: Language;
  code: string;
  children?: any;
}
function CodeBlock({ code, language }: CodeBlockProps) {
  return (
    <div>
      <Highlight
        {...defaultProps}
        theme={theme}
        code={code}
        language={language}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <Pre className={className} style={style}>
            {tokens.map((line, i) => (
              <div {...getLineProps({ line, key: i })}>
                {line.map((token, key) => (
                  <span {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </Pre>
        )}
      </Highlight>
    </div>
  );
}

export default CodeBlock;
