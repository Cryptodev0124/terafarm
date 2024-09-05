import { AppTheme } from 'theme'
import { createGlobalStyle } from 'styled-components'

declare module 'styled-components' {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  export interface DefaultTheme extends AppTheme {}
}

const GlobalStyle = createGlobalStyle`
  * {
    font-family: 'Basel', sans-serif;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    overflow-x: hidden;
    margin: auto;
    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    overflow: auto;
    background: linear-gradient(315deg, rgba(101,0,94,1) 3%, rgba(60,132,206,1) 38%, rgba(48,238,226,1) 68%, rgba(255,25,25,1) 98%);
    animation: gradient 15s ease infinite;
    background-size: 400% 400%;
    background-attachment: fixed;

    img {
      height: auto;
      max-width: 100%;
    }

    .firstScreen {
      width: 100%; 
      display: flex; 
      flex-direction: column; 
      position: absolute; 
      top: 50%; 
      left: 50%; 
      transform: translate(-50%, 50%); 
      height: 40vh;
      @media screen and (max-width: 768px) {
        margin-left: 0;
        height: 47vh;
      }
    }

    .disclaimerSection {
      display: flex;
      flex-direction: column;
      margin-top: 60px;
      padding: 10px;
      @media screen and (max-width: 767px) {
        background: #000000;
        margin-left: 0;
        margin-top: 150px;
        padding-bottom: 50px;
      }
    }

    .textSection {
      display: flex;
      flex-direction: column;
      width: 50%;
      @media screen and (max-width: 768px) {
        width: 100%;
      }
    }

    .mainPage {
      width: 80%;
      margin: auto;
      border-radius: 24px;
      min-height: calc(100vh - 64px);
      padding-top: 16px;
      padding-bottom: 16px;
      // background: #00000070;
      @media screen and (max-width: 768px) {
        width: 95%;
      }
      
      @media screen and (min-width: 576px) {
        padding-top: 32px;
        padding-bottom: 32px;
      }
    }

    .pageBody {
      display: flex;
      flex-direction: column;
      padding: 24px;
    }

    .mainPage1 {
      width: 70%;
      margin: auto;
      border-radius: 24px;
      min-height: calc(100vh - 64px);
      padding-top: 16px;
      padding-bottom: 16px;
      // background: #00000070;
      @media screen and (max-width: 768px) {
        width: 95%;
      }
      @media screen and (min-width: 968px) {
        padding: 150px;
      }
      
      @media screen and (min-width: 576px) {
        padding-top: 32px;
        padding-bottom: 32px;
      }
    }

    .actionPanel {
      display: flex; 
      flex-direction: column; 
      background: #101418; 
      width: 90%; 
      margin-top: 30px; 
      border-radius: 24px; 
      padding: 15px;
    }

    .pairInfo {
       width: 90%; 
       padding: 15px;
       @media screen and (max-width: 768px) {
        width: 100%;
        padding: 5px;
       }
    }

    .pairImg {
      width: 10%;
      @media screen and (max-width: 768px) {
        width: 12%;
      }
    }

    .progress1 {
       width: 100%; 
       padding: 15px;
       @media screen and (max-width: 768px) {
        padding: 5px;
       }
    }

    .progressBar1 {
       width: 90%; 
       margin: auto; 
       height: 10px;
       @media screen and (max-width: 768px) {
        width: 100%;
       }
    }

    .actions {
      width: 90%;
      margin-top: 20px;
      @media screen and (max-width: 768px) {
        flex-direction: column;
        width: 100%;
      }
    }

    .stakeAction {
      max-width: 500px;
      width: 100%;
    }

    .liquiditySec {
      width: 100%;
      display: flex;
      justify-content: space-around;
      padding: 20px;
    }
  }

  @keyframes gradient {
    0% {
        background-position: 0% 0%;
    }
    50% {
        background-position: 100% 100%;
    }
    100% {
        background-position: 0% 0%;
    }
}

.wave {
    background: rgb(255 255 255 / 25%);
    border-radius: 1000% 1000% 0 0;
    position: fixed;
    width: 200%;
    height: 12em;
    animation: wave 10s -3s linear infinite;
    transform: translate3d(0, 0, 0);
    opacity: 0.8;
    bottom: 0;
    left: 0;
    z-index: -1;
}

.wave:nth-of-type(2) {
    bottom: -1.25em;
    animation: wave 18s linear reverse infinite;
    opacity: 0.8;
}

.wave:nth-of-type(3) {
    bottom: -2.5em;
    animation: wave 20s -1s reverse infinite;
    opacity: 0.9;
}

@keyframes wave {
    2% {
        transform: translateX(1);
    }

    25% {
        transform: translateX(-25%);
    }

    50% {
        transform: translateX(-50%);
    }

    75% {
        transform: translateX(-25%);
    }

    100% {
        transform: translateX(1);
    }
}

  #__next {
    position: relative;
  }

  #portal-root {
    position: relative;
  }

  @font-face {
    font-family: "Basel";
    font-style: normal;
    font-weight: 485;
    src: url("/fonts/Basel-Grotesk-Book.woff2") format("woff2");
`

export default GlobalStyle
