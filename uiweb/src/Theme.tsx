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
      })
   },
   componentStyles: {
      Flex: {
         root: ({ variables }) => ({
            color: variables.color,
            backgroundColor: variables.backgroundColor,
         }),
      }
   }
}

export const appThemeLight = {
   siteVariables: {
      brandForeground: brandForeground,
      brandHighlight: brandHighlight,
      brandBackground: brandBackground
   },
   componentVariables: {
      Card: ({ colorScheme }) => ({
         color: '#666666',
         backgroundColor: '#fff',
      }),
      Chat: ({ colorScheme }) => ({
         color: '#666666',
         backgroundColor: '#fff',
      }),
      ChatMessage: ({ colorScheme }) => ({
         color: '#666666',
         backgroundColor: '#fff',
      })
   },
   componentStyles: {
      AvatarImage: {
         root: ({ variables }) => ({
            border: '1px solid #000'
         })
      },
      Card: {
         root: ({ variables }) => ({
            color: variables.color,
            backgroundColor: variables.backgroundColor,
         })
      },
      Chat: {
         root: ({ variables }) => ({
            color: variables.color,
            backgroundColor: variables.backgroundColor,
         })
      },
      ChatMessage: {
         root: ({ variables }) => ({
            color: variables.color,
            backgroundColor: variables.backgroundColor,
            border: '1px solid #000'
         })
      }
   }
}