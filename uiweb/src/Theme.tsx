/*! Copyright TXPCo, 2020, 2021 */

export const appTheme = {
   siteVariables: {
      brandForeground: '#fff',
      brandHighlight: '#2dc997',
      brandBackground: '#666666'
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
   },
}


