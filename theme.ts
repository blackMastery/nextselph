import {
  faUser,
  faSmile,
  faUserCircle,
  faPlayCircle,
  faTrashAlt,
  faPen,
  faLongArrowAltLeft,
  faClipboard
} from "@fortawesome/free-solid-svg-icons";

const theme = {
  palette: {
    primary: '#007aff',
    primaryInverted: "#fbfbfb",
    dark: "#000",
    darkInverted: "#fbfbfb",
    dark100: "#707070",
    dark200: "#707070",
    darkTint: "#00000015"
  },
  fonts: {
    heading: "'Oswald', sans-serif"
  },
  Button: {
    styles: {
      base: {
        borderRadius: "none"
      }
    }
  },
  SideNav: {
    Item: {
      styles: {
        base: {
          color: "#fff"
        },
        active: {
          background: "#29303D",
          color: "#FBFBFB"
        }
      }
    },
    styles: {
      base: {
        background: "#1D222B",
        color: "#FBFBFB",
      }
    },
    Level: {
      styles: {
        base: {
          color: "#FBFBFB"
        }
      }
    }
  },
  Icon: {
    iconSets: [
      {
        icons: [
          faUser,
          faSmile,
          faUserCircle,
          faPlayCircle,
          faTrashAlt,
          faPen,
          faLongArrowAltLeft,
          faClipboard
        ],
        prefix: "solid-",
        type: "font-awesome",
      },
    ],
  },
};

export default theme;
