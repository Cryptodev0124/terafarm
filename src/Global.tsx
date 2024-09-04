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
    background: transparent;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    overflow-x: hidden;

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
      background: #00000070;
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
      background: #00000070;
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
