/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import * as React from 'react';
import { StyleSheet, Text, SafeAreaView } from 'react-native';
import { Provider as PaperProvider, Appbar, BottomNavigation } from "react-native-paper";
import theme from "./Theme";

const TopBar = () => (
   <Appbar style={styles.topbar}>
      <Appbar.Content titleStyle={{ textAlign: 'center' }} title="UltraBox" />
   </Appbar>
);

export class ProfileScreen extends React.Component {

   render() {
      return (
         <SafeAreaView style={styles.container}>
            <TopBar/>
            <Text style={styles.welcome}>
               React Native Profile Page!
            </Text>
         </SafeAreaView>
      );
   }
}

export class HomeScreen extends React.Component {

   render() {
      return (
         <SafeAreaView style={styles.container}>
            <TopBar />
            <Text style={styles.welcome}>
               React Native Home Page!
            </Text>
         </SafeAreaView>
      );
   }
}

const HomeRoute = () => (
   <HomeScreen/>
);

const ProfileRoute = () => (
   <ProfileScreen />
);


const MainScreen = () => {
   const [index, setIndex] = React.useState(0);
   const [routes] = React.useState([
      { key: "home", title: "Home", icon: 'home' },
      { key: "profile", title: "Profile", icon: "home-account" },
   ]);

   const renderScene = BottomNavigation.SceneMap({
      home: HomeRoute,
      profile: ProfileRoute,
   });

   return (
      <BottomNavigation
         navigationState={{ index, routes }}
         onIndexChange={setIndex}
         renderScene={renderScene}
      />
   );
};

export class App extends React.Component {

   render() {
      return (
         <PaperProvider theme={theme}>
            <MainScreen/>
         </PaperProvider>
      );
   }
}


// styles
const styles = StyleSheet.create({
   topbar: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      alignItems: "center",
      textAlign: 'center',
      justifyContent: "center"
   },
   container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
   },
   welcome: {
      fontSize: 20,
      textAlign: 'center',
      margin: 10,
   }
});

export default App;