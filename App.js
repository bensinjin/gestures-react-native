import React from 'react';
import { StyleSheet, Text, View, Image, PanResponder } from 'react-native';

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

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentZoom: settings.defaultZoom
    };
    this.lastTapTimeStamp = this._getTs();
    this.pic = { uri: settings.imageUri };
  }

  componentWillMount() {
    // This is how we monitor swipes & taps.
    this._panResponder = PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => true,
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
      onPanResponderRelease: (evt, gestureState) => {
        // This is pretty shit but work for demo purposes.
        // I might propose not implement your own "double tap"
        // but opting to use a library instead, many exist.
        //
        // This basically says if we're not moving along the x axis (our zoom gesture for this app)
        // and we're not sitting at the default zoom then reset the zoom to the default.
        if (gestureState.vx == 0 && this.state.currentZoom != settings.defaultZoom) {
          let currentTS = this._getTs();
          // With default settings we're basically saying a double tap is two
          // taps with less than or equal to 750ms between them.
          if (currentTS - this.lastTapTimeStamp <= settings.tapMillis) {
            this._zoomReset();
          }
          this.lastTapTimeStamp = currentTS;
        }
      },
    });
  }

  render() {
    let imgStyle = {width: this.state.currentZoom, height: this.state.currentZoom};
    return (
      <View style={styles.container} {...this._panResponder.panHandlers}>
        <Image source={this.pic} style={imgStyle}/>
        <Text>Zoom level: {this.state.currentZoom}</Text>
        <Text>Drag left or right to zoom.</Text>
        <Text>Double tap to reset zoom.</Text>
      </View>
    );
  }

  _getTs() {
    return new Date().getTime();
  }

  _zoomIn() {
    this.setState(previousState => {
      return { currentZoom: previousState.currentZoom - settings.zoomIncr };
    });
  }

  _zoomOut() {
    this.setState(previousState => {
      return { currentZoom: previousState.currentZoom + settings.zoomIncr };
    });
  }

  _zoomReset() {
    this.setState(previousState => {
      return { currentZoom: settings.defaultZoom }
    });
  }
}
