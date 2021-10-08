import {
  Card,
  Heading,
  Alert,
  Box,
  Button,
  Divider,
  Link as BLink,
  Stack,
  useToasts,
  Flex,
} from "bumbag";
import React, { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import AuthForm from "../components/AuthForm";
import Link from "next/link";
import { LoginSchema } from "../schema";
import useLogin from "../hooks/auth/useLogin";
import useGoogleAuth from "@/hooks/auth/useGoogleAuth";
import useSendEmailConfirmation from "@/hooks/auth/useSendEmailConfirmation";
import Image from "next/image";
import { Tabs } from 'bumbag';
import { SignUpSchema } from "../schema";
import useSignUp from "@/hooks/auth/useSignUp";
// import useGoogleAuth from "@/hooks/auth/useGoogleAuth";
// import Image from "next/image"
// import { Divider } from 'bumbag'


function LoginPage() {
  const [email, setEmail] = useState("");
  const [tab, setTab] = useState("tab1");

  const router = useRouter();
  const toasts = useToasts();
  const {
    mutate: login,
    isLoading,
    error,
    isEmailConfirmed,
  } = useLogin({
    onSuccess: ({ data }) => data?.jwt && onLoginSuccess(data?.jwt),
  });
  const {
    isSuccess: isSendEmailConfirmationSuccess,
    mutate: sendEmailConfirmation,
    isLoading: isSendEmailConfirmationLoading,
  } = useSendEmailConfirmation();

  const onLoginSuccess = (token: string) => {
    // store token in localstorage
    localStorage.setItem("token", token);
    router.push("/dashboard");
    toasts.success({
      title: "Welcome back!",
      message: "Login was successful.",
    });
  };

  const { signIn } = useGoogleAuth();
  const { mutate: signUp, error: signUpError, isLoading: signUpIsLoading } = useSignUp({
    onSuccess: () => {
      toasts.success({
        title: "Account Created!",
        message: "Thank you for creating an account",
      });
    }
  })

  // const toasts = useToasts();
  // const { signIn } = useGoogleAuth();

  return (
    <Box backgroundColor="red">
      <Head>
        <title>Login</title>
      </Head>

      <Box display="flex" justifyContent="center" marginTop="100px">
        <Card width="600px">
          <Stack alignX="center" marginY="minor-5">
            <Image src="/logo-dark.png" width="275" height="85"></Image>
          </Stack>
     
          {error && (
            <>
              <Alert
                accent="top"
                type="danger"
                marginY="minor-5"
                variant="fill"
              >
                {isEmailConfirmed
                  ? "Invalid login credentials provided."
                  : "You need to confirm your email before you can login. "}
              </Alert>
              {/*{!isEmailConfirmed && !isSendEmailConfirmationSuccess && <Stack alignX="center">*/}
              {/*	<Button isLoading={isSendEmailConfirmationLoading} variant="ghost" palette="primary" textDecoration="underline" onClick={() => sendEmailConfirmation({ email })}>Resend Confirmation Email</Button>*/}
              {/*</Stack>}*/}
            </>
          )}



<Tabs isFitted defaultSelectedId={tab} selectedId={tab}>
  <Tabs.List>
    <Tabs.Tab tabId="tab1">Login</Tabs.Tab>
    <Tabs.Tab tabId="tab2">Register</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel tabId="tab1" padding="major-2">

  <Button  
     backgroundColor='#22b93b'
     color='#ffffff'
  marginBottom="15px"  width="100% " onClick={() => signIn()}>Sign In with Google</Button>

 
<Divider marginY="minor-4"></Divider>

  

  <AuthForm
            isLoading={isLoading}
            submitText="Login"
            onSubmit={(email, password) => {
              setEmail(email);
              login({ email, password });
            }}
            schema={LoginSchema}
          ></AuthForm>
   

          {/* <Divider marginY="minor-4"></Divider>
          <Stack alignX="center" >
            <d>

            <Link href="#" onClick={()=> setTab('tab2')}>
              <BLink>I don't have an account</BLink>
            </Link>
            </d>
          </Stack> */}
  </Tabs.Panel>


  <Tabs.Panel tabId="tab2" padding="major-2">
            <Button
            width="100% "
             backgroundColor='#22b93b'
             color='#ffffff'
              onClick={() => signIn()}
              disabled={signUpIsLoading}
            >
              Sign Up with Google
            </Button>
            <Divider marginY="minor-4"></Divider>
 
  <AuthForm
            submitText="Register"
            onSubmit={async (email, password) =>
              signUp({ email, password })
            }
            schema={SignUpSchema}
            isLoading={signUpIsLoading}
          ></AuthForm>
</Tabs.Panel>

{/* <Divider marginY="minor-4"></Divider>
          <Stack alignX="center" onClick={()=> setTab('tab1')}>
            <Link href="#" >
              <BLink>I already have an account</BLink>
            </Link>
          </Stack>
   */}



</Tabs>
         




       
        </Card>
      </Box>
    </Box >
  );
}

export default LoginPage;
