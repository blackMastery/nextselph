import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import useUser from "@/hooks/useUser";
import useSelphs from "@/hooks/selph/queries/useSelphs";
import Head from 'next/head'
import { QueryCache, useQuery } from 'react-query'
import { httpClient } from "utils/httpClient";
import { Selph } from "models/selph";


function SelphInteractionPage({selph}) {
  const router = useRouter();
  const { handle } = router.query;

  // let [overlay_name , set_overlay_name] =  useState('selphio__overlay_dots')


 

const {data:selphs} = useQuery<Selph[]>(
  
  "selph",
  async () => {
    const { data } = await httpClient.get(`/selph`);
    console.log({ data })

    return data;
  },
);




  const _selph =  selphs?.find(s=> s.handle === handle)
  console.log(selph, selphs,  handle)
  
  
  // let curr_self;
  
  
  
  
  
  useEffect(() => {
  
    if (typeof handle === "string") {
      const messenger = document.createElement("script");
      const tweenMax = document.createElement("script");
      
      console.log(document.title, typeof handle === "string")
      messenger.src = `/messenger/js/selph.messenger.js?r=${Math.random()}`;
      messenger.setAttribute("data-id", "tslphmsn");
      messenger.setAttribute("data-selphid", handle || "");
      messenger.setAttribute(
        "data-server",
        process.env.NEXT_PUBLIC_BACKEND_URL
      );

      tweenMax.src = `/messenger/js/TweenMax.min.js`;
      document.body.appendChild(tweenMax);
      document.body.appendChild(messenger);

      return () => {
        document.body.removeChild(tweenMax);
        document.body.removeChild(messenger);
      };
    }
  }, [handle]);




  if (typeof window === "undefined") {
    return <div></div>;
  }




  return (
    <div>
 
      <Head>
        <title>Interact</title>
    <script src="https://unpkg.com/video.js/dist/video.js"></script>
    <script src="https://unpkg.com/@videojs/http-streaming/dist/videojs-http-streaming.js"></script>
        <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
  />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"/>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossOrigin="anonymous"/ >
_
        <link
          rel="stylesheet"
          href={`/messenger/css/selph.messenger.css?q=${Math.random()}`}
        />

{
    _selph && ( 
     <Head>


      <meta property="og:description" content={_selph.description} key="description" />
     {/* <meta property="og:url"content={selph.thumbnail?.formats?.thumbnail?.url} key="url" /> */}
     <meta property="og:title"   content={_selph.name} key='title' />
     {/* <meta property="og:image"   content={selph.thumbnail?.formats?.thumbnail?.url} /> */}

     <meta property="twitter:description" content={_selph.description} key="description" />
     {/* <meta property="twitter:url"content={selph.thumbnail?.formats?.thumbnail?.url} key="url" /> */}
     <meta property="twitter:title"   content={_selph.name} key='title' />
     {/* <meta property="twitter:image"   content={selph.thumbnail?.formats?.thumbnail?.url} /> */}
     
      </Head>

     )}
      </Head>
      <div id="selphio" className="selphio__container">


    
        <div id="selphio__loadmask">
            <svg
              id="selphio__logo"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              width="100"
              height="100"
              viewBox="0, 0, 400,400"
            >
              <g id="svgg">
                <path
                  id="path0"
                  d="M13.013 3.325 C 7.861 6.016,6.016 7.861,3.325 13.013 L 0.000 19.377 0.000 200.000 L 0.000 380.623 3.325 386.987 C 6.016 392.139,7.861 393.984,13.013 396.675 L 19.377 400.000 199.838 399.974 C 399.548 399.945,385.322 400.483,392.806 392.673 C 400.489 384.656,399.948 399.271,399.948 200.000 C 399.948 0.729,400.489 15.344,392.806 7.327 C 385.322 -0.483,399.548 0.055,199.838 0.026 L 19.377 -0.000 13.013 3.325 M243.198 140.408 C 250.289 145.666,251.940 149.738,251.940 161.968 L 251.940 173.134 242.388 173.134 L 232.836 173.134 232.836 164.776 L 232.836 156.418 201.194 156.418 L 169.552 156.418 169.552 174.874 L 169.552 193.331 204.691 193.680 C 253.027 194.161,251.940 193.302,251.940 231.045 C 251.940 269.294,253.653 268.060,200.597 268.060 C 151.041 268.060,150.236 267.692,149.440 244.692 L 149.030 232.836 158.694 232.836 L 168.358 232.836 168.358 241.194 L 168.358 249.552 200.597 249.552 L 232.836 249.552 232.836 231.045 L 232.836 212.537 199.780 212.537 C 150.847 212.537,151.538 213.076,151.538 174.925 C 151.538 136.263,150.353 137.119,203.198 137.586 C 238.228 137.896,239.977 138.020,243.198 140.408 M122.388 148.060 L 122.388 157.015 74.328 157.327 L 26.269 157.639 26.269 148.060 L 26.269 138.480 74.328 138.792 L 122.388 139.104 122.388 148.060 M377.313 148.060 L 377.313 157.612 329.552 157.612 L 281.791 157.612 281.791 148.060 L 281.791 138.507 329.552 138.507 L 377.313 138.507 377.313 148.060 M121.791 202.999 L 121.791 212.564 73.731 212.252 L 25.672 211.940 25.312 204.305 C 25.114 200.105,25.231 195.941,25.573 195.051 C 26.081 193.727,34.874 193.433,73.992 193.433 L 121.791 193.433 121.791 202.999 M377.313 202.388 L 377.313 211.343 328.955 211.343 L 280.597 211.343 280.597 202.388 L 280.597 193.433 328.955 193.433 L 377.313 193.433 377.313 202.388 M122.388 257.910 L 122.388 266.866 74.328 267.178 L 26.269 267.490 26.269 257.910 L 26.269 248.331 74.328 248.643 L 122.388 248.955 122.388 257.910 M377.313 257.910 L 377.313 267.463 329.552 267.463 L 281.791 267.463 281.791 257.910 L 281.791 248.358 329.552 248.358 L 377.313 248.358 377.313 257.910 "
                  stroke="none"
                  fill="#000000"
                  fillRule="evenodd"
                ></path>
              </g>
            </svg>
            <br />
            <svg id="selphio__spinner" viewBox="0 0 50 50">
              <circle
                className="path"
                cx="25"
                cy="25"
                r="20"
                fill="none"
                strokeWidth="1"
              ></circle>
            </svg>
          </div>
        <div id="selphio__player">
          <video
            id="idlePlayer"
            crossOrigin="anonymous"
            className="selphio_sequence idle"
            playsInline
            autoPlay
            muted
            loop
          >
            <source src=""></source>
          </video>
          <video
            id="activePlayer"
            crossOrigin="anonymous"
            playsInline
            autoPlay
            className="selphio_sequence "
          >
            <source id="activeSequence" src=""></source>
          </video>
        </div>

        <div id="selphio__input">
        <div className="avator_wrap">
        </div>  
 {_selph && (
          <div className="avator_wrap">

          {_selph.thumbnail
        ? <img src={_selph.thumbnail}  className="avatar"/>
        : <div className="avatar"></div>
      }

              <h2>{_selph.name}</h2>

          </div>)} 


          <div className="__header"></div>
          <div className="__body">
            <div id="selphio__dialog">
              <ol className="chat-messages-list"></ol>
            </div>

          
          </div>
          <div className="chat-loader-container">
            <div className="chat-loader-bar"></div>
            <div className="chat-info-container"></div>
          </div>
            
          <ul className="list-group">
        </ul>
          <div className="__footer">
       
          <button id="selphio__sttToggle">
            <svg
              viewBox="-90 1 511 511.99899"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="m332.464844 275.082031c0-8.429687-6.835938-15.265625-15.269532-15.265625-8.433593 0-15.269531 6.835938-15.269531 15.265625 0 74.6875-60.757812 135.445313-135.445312 135.445313-74.683594 0-135.441407-60.757813-135.441407-135.445313 0-8.429687-6.835937-15.265625-15.269531-15.265625-8.433593 0-15.269531 6.835938-15.269531 15.265625 0 86.378907 66.320312 157.539063 150.710938 165.273438v41.105469h-56.664063c-8.433594 0-15.269531 6.835937-15.269531 15.269531 0 8.433593 6.835937 15.269531 15.269531 15.269531h143.871094c8.429687 0 15.265625-6.835938 15.265625-15.269531 0-8.433594-6.835938-15.269531-15.265625-15.269531h-56.667969v-41.105469c84.394531-7.730469 150.714844-78.894531 150.714844-165.273438zm0 0" />
              <path d="m166.480469 372.851562c53.910156 0 97.769531-43.859374 97.769531-97.769531v-177.316406c0-53.90625-43.859375-97.765625-97.769531-97.765625-53.90625 0-97.765625 43.859375-97.765625 97.765625v177.316406c0 53.910157 43.859375 97.769531 97.765625 97.769531zm-67.230469-275.085937c0-37.070313 30.160156-67.226563 67.230469-67.226563 37.070312 0 67.230469 30.15625 67.230469 67.226563v177.316406c0 37.070313-30.160157 67.230469-67.230469 67.230469-37.070313 0-67.230469-30.160156-67.230469-67.230469zm0 0" />
            </svg>
          </button> 
       
          <form id="selphio__inputForm" autoComplete="off">
            <input
              id="selphio__inputField"
              type="text"
              placeholder="ask me something..."
              className="dark-bg"
            />
            <button type="submit" id="selphio__submit">
              <svg
                version="1.1"
                id="Capa_1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                x="0px"
                y="0px"
                viewBox="0 0 488.721 488.721"
                style={{
                  fill: "black",
                }}
                xmlSpace="preserve"
              >
                {" "}
                <g>
                  {" "}
                  <g>
                    {" "}
                    <path d="M483.589,222.024c-5.022-10.369-13.394-18.741-23.762-23.762L73.522,11.331C48.074-0.998,17.451,9.638,5.122,35.086 C-1.159,48.052-1.687,63.065,3.669,76.44l67.174,167.902L3.669,412.261c-10.463,26.341,2.409,56.177,28.75,66.639 c5.956,2.366,12.303,3.595,18.712,3.624c7.754,0,15.408-1.75,22.391-5.12l386.304-186.982 C485.276,278.096,495.915,247.473,483.589,222.024z M58.657,446.633c-8.484,4.107-18.691,0.559-22.798-7.925 c-2.093-4.322-2.267-9.326-0.481-13.784l65.399-163.516h340.668L58.657,446.633z M100.778,227.275L35.379,63.759 c-2.722-6.518-1.032-14.045,4.215-18.773c5.079-4.949,12.748-6.11,19.063-2.884l382.788,185.173H100.778z" />{" "}
                  </g>{" "}
                </g>{" "}
                <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g>{" "}
                <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g>{" "}
                <g> </g>{" "}
              </svg>
              &nbsp;
            </button>
          </form>
        </div>
     
     
     
     
        </div>
     
     
      </div>
    </div>
  );
}

 //SelphInteractionPage.getInitialProps = async (ctx) => {

// const { data } = await httpClient.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/selph`
// );




// const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/selph`).then(res => res)
//     if (!res) return { statusCode: 404 }
//     return { selph: res }


//}

export default SelphInteractionPage;


//  TODO: remove from the dots from the player