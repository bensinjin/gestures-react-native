import React from 'react';
import { Alert, AppRegistry, Platform, StyleSheet, Text, TouchableHighlight, TouchableOpacity, TouchableNativeFeedback, TouchableWithoutFeedback, View, Image, PanResponder } from 'react-native';

export default class App extends React.Component {
  // The component class constructor.
  // The parameters to the constructor are the element's initial props, as specified by the parent element.
  // We've assigned an initial state for this component by assigning an object to this.state.
  // At this point, no native UI has been rendered yet for this element.
  constructor(props) {
    super(props);
    this.state = {
      currentZoom: settings.defaultZoom,
      imageUri: settings.imageUri1
    };
    this.lastTapTimeStamp = this._getTs();
  }
  // This method is invoked only once, before rendering occurs for the first time.
  // At this point, there is still no native UI rendered for this element.
  componentWillMount() {
    // This is how we'll monitor swipes & taps.
    this._panResponder = PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      // Callback for move events.
      onPanResponderMove: (evt, gestureState) => {
        // A swipe from left to right.
        if (gestureState.dx > 0) {
          this._zoomIn();
        }
        // A swipe from right to left.
        else {
          this._zoomOut();
        }
      },
      // Callback for release events.
      onPanResponderRelease: (evt, gestureState) => {
        // This is pretty shit but work for demo purposes.
        // I might propose not implement your own "double tap"
        // but opting to use a library instead, many exist.
        //
        // If we have no velocity along the x or y axis (we don't want the app to accept a swipe as a tap).
        if (gestureState.vx == 0 && gestureState.vy == 0) {
          // Set the current timestamp in ms.
          let currentTS = this._getTs();
          // If the current timestamp - the last timestamp is less than by default 500ms
          // we'll consider this a 'double tap'. Go ahead and reset the zoom level.
          if (currentTS - this.lastTapTimeStamp <= settings.tapMillis) {
            this._zoomReset();
          }
          this.lastTapTimeStamp = currentTS;
        }
      },
    });
  }

  // The render method must return a React Element (JSX) to render (or null, to render nothing).
  render() {
    let imgStyle = {width: this.state.currentZoom, height: this.state.currentZoom},
        img = {uri: this.state.imageUri};
    // This is our View component.  React will keep track of changes to state
    // variables and update the view accordingly.
    return (
      // Here we're pass properties to the View component just as our constructor recieve props.
      // The spread operator (...) expands the panHandlers object which houses our callback definitions.
      <View style={styles.container} {...this._panResponder.panHandlers}>
        <Text style={styles.titleText}>
          Weird Fruit
        </Text>
        <Image source={img} style={imgStyle}/>
        <Text style={styles.text}>
          Zoom level: {this.state.currentZoom}{'\n'}
          Drag left or right to zoom.{'\n'}
          Double tap to reset zoom.{'\n'}
        </Text>
        <Text style={styles.nextText} onLongPress={() => {this._nextPicture()}}>
          **Hold here for next image**
        </Text>
      </View>
    );
  }

  // Get a timestamp in ms.
  _getTs() {
    return new Date().getTime();
  }

  // Increase our currentZoom state variable.
  _zoomIn() {
    if (this.state.currentZoom <= settings.maxZoom) {
      this.setState(previousState => {
        return { currentZoom: previousState.currentZoom + settings.zoomIncr };
      });
    }
  }

  // Decrease our currentZoom state variable.
  _zoomOut() {
    if (this.state.currentZoom >= settings.minZoom) {
      this.setState(previousState => {
        return { currentZoom: previousState.currentZoom - settings.zoomIncr };
      });
    }
  }

  // Reset to our settings.defaultZoom value.
  _zoomReset() {
    this.setState(previousState => {
      return { currentZoom: settings.defaultZoom }
    });
  }

  // Select the next image.
  _nextPicture() {
    this.setState(previousState => {
      let uri = previousState.imageUri == settings.imageUri1 ? settings.imageUri2 : settings.imageUri1;
      return {
        imageUri: uri
      }
    });
  }
}

// Some default styles.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 35,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 15,
  },
  nextText: {
    fontSize: 20,
    fontWeight: 'bold',
  }
});

// Some default settings.
const settings = {
  zoomIncr : 5,
  defaultZoom: 200,
  maxZoom: 495,
  minZoom: 5,
  tapMillis: 500,
  imageUri1: "http://wdy.h-cdn.co/assets/cm/15/09/768x516/54ebb801e0bf8_-_6-kiwano-xl.jpg",
  imageUri2: "https://i.pinimg.com/736x/65/25/c9/6525c9b73eeb9527a8eb326e4e4fbe3b--weird-fruit-strange-fruit.jpg"
}