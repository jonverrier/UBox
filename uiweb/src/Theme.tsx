/*! Copyright TXPCo, 2020, 2021 */

export const brandForeground = '#fff';
export const brandHighlight = '#2dc997';
export const brandBackground = '#666666';

export const appTheme = {
   siteVariables: {
      brandForeground: brandForeground,
      brandHighlight: brandHighlight,
      brandBackground: brandBackground
   } 
}

export const appThemeDark = {
   siteVariables: {
      brandForeground: brandForeground,
      brandHighlight: brandHighlight,
      brandBackground: brandBackground
   },
   componentVariables: {
      Flex: ({ colorScheme }) => ({
         color: '#fff',
         backgroundColor: '#666666',
      }),
   },
   componentStyles: {
      Flex: {
         root: ({ variables }) => ({
            color: variables.color,
            backgroundColor: variables.backgroundColor,
         }),
      },
   }
}

