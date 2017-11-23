import React from 'react';
import { StyleSheet, Text, View, Image, PanResponder } from 'react-native';

export default class App extends React.Component {
  // The component class constructor.
  // The parameters to the constructor are the element's initial props, as specified by the parent element.
  // We've assigned an initial state for this component by assigning an object to this.state.
  // At this point, no native UI has been rendered yet for this element.
  constructor(props) {
    super(props);
    this.state = {
      currentZoom: settings.defaultZoom
    };
    this.lastTapTimeStamp = this._getTs();
    this.pic = { uri: settings.imageUri };
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
    let imgStyle = {width: this.state.currentZoom, height: this.state.currentZoom};
    // This is our View component.  React will keep track of changes to state
    // variables and update the view accordingly.
    return (
      // Here we're pass properties to the View component just as our constructor recieve props.
      // The spread operator (...) expands the panHandlers object which houses our callback definitions.
      <View style={styles.container} {...this._panResponder.panHandlers}>
        <Image source={this.pic} style={imgStyle}/>
        <Text>Zoom level: {this.state.currentZoom}</Text>
        <Text>Drag left or right to zoom.</Text>
        <Text>Double tap to reset zoom.</Text>
      </View>
    );
  }

  // Get a timestamp in ms.
  _getTs() {
    return new Date().getTime();
  }

  // Increase our currentZoom state variable.
  _zoomIn() {
    this.setState(previousState => {
      return { currentZoom: previousState.currentZoom - settings.zoomIncr };
    });
  }

  // Decrease our currentZoom state variable.
  _zoomOut() {
    this.setState(previousState => {
      return { currentZoom: previousState.currentZoom + settings.zoomIncr };
    });
  }

  // Reset to our settings.defaultZoom value.
  _zoomReset() {
    this.setState(previousState => {
      return { currentZoom: settings.defaultZoom }
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
  }
});

// Some default settings.
const settings = {
  zoomIncr : 5,
  defaultZoom: 100,
  tapMillis: 500,
  imageUri: "https://moduscreate.com/wp-content/uploads/2015/07/ReactNativelogo.png"
}