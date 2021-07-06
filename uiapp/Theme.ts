// JavaScript source code
import { configureFonts, DefaultTheme } from "react-native-paper";

const fontConfig  = {
   ios: {
      regular: {
         fontFamily: "System",
         fontWeight: "400",
      },
      medium: {
         fontFamily: "System",
         fontWeight: "500",
      },
      light: {
         fontFamily: "System",
         fontWeight: "300",
      },
      thin: {
         fontFamily: "System",
         fontWeight: "100",
      },
   },
   default: {
      regular: {
         fontFamily: "sans-serif",
         fontWeight: "normal",
      },
      medium: {
         fontFamily: "sans-serif-medium",
         fontWeight: "normal",
      },
      light: {
         fontFamily: "sans-serif-light",
         fontWeight: "normal",
      },
      thin: {
         fontFamily: "sans-serif-thin",
         fontWeight: "normal",
      },
   },
};

const theme = {
   ...DefaultTheme,
   colors: {
      ...DefaultTheme.colors,
      primary: '#2c6157',
      secondary: '#6fd056',
   },
};

export default theme;