/********************************************************************
  RENDERER PLACEHOLDER
*********************************************************************/
var React = require('react'),
    Utils = require('./components/utils'),
    CONSTANTS = require('./constants/constants'),
    Spinner = require('./components/spinner'),
    AdScreen = require('./views/adScreen'),
    ClosedCaptionScreen = require('./views/closedCaptionScreen'),
    DiscoveryScreen = require('./views/discoveryScreen'),
    EndScreen = require('./views/endScreen'),
    MoreOptionsScreen = require('./views/moreOptionsScreen'),
    ShareScreen = require('./views/shareScreen'),
    StartScreen = require('./views/startScreen'),
    PauseScreen = require('./views/pauseScreen'),
    PlayingScreen = require('./views/playingScreen'),
    ErrorScreen = require('./views/errorScreen'),
    ComponentWidthMixin = require('./mixins/componentWidthMixin'),
    ClassNames = require('classnames');

var Skin = React.createClass({
  mixins: [ComponentWidthMixin],

  getInitialState: function() {
    this.overlayRenderingEventSent = false;
    return {
      screenToShow: null,
      currentPlayhead: 0,
      discoveryData: null
    };
  },

  componentDidUpdate: function() {
    // Notify AMC the correct overlay rendering info
    if (this.state.screenToShow !== null && !this.overlayRenderingEventSent) {
      var marginHeight = Utils.getScaledControlBarHeight(this.getDOMNode().clientWidth) + CONSTANTS.UI.defaultScrubberBarHeight;
      this.props.controller.publishOverlayRenderingEvent(marginHeight);
      this.overlayRenderingEventSent = true;
    }
  },

  componentDidMount: function () {
    window.addEventListener('mouseup', this.handleClickOutsidePlayer);
  },

  componentWillMount: function() {
    if (this.props.skinConfig.closedCaptionOptions){
      this.props.controller.state.closedCaptionOptions.language = (this.props.skinConfig.closedCaptionOptions.defaultLanguage ? this.props.skinConfig.closedCaptionOptions.defaultLanguage : "en" );
      this.props.controller.state.closedCaptionOptions.enabled = (this.props.skinConfig.closedCaptionOptions.defaultEnabled ? this.props.skinConfig.closedCaptionOptions.defaultEnabled : false);
    }
    else {
      this.props.controller.state.closedCaptionOptions.language = "en";
      this.props.controller.state.closedCaptionOptions.enabled = false;
    }
  },

  componentWillUnmount: function () {
    window.removeEventListener('mouseup', this.handleClickOutsidePlayer);
  },

  handleClickOutsidePlayer: function() {
    this.props.controller.state.accessibilityControlsEnabled = false;
  },

  switchComponent: function(args) {
    var newState = args || {};
    this.setState(newState);
  },

  updatePlayhead: function(newPlayhead, newDuration, newBuffered) {
    this.setState({
      currentPlayhead: newPlayhead,
      duration: newDuration,
      buffered: newBuffered
    });
  },

  render: function() {
    var responsiveClass = ClassNames({
      'small': this.state.componentWidth <= 560,
      'medium': this.state.componentWidth > 560 && this.state.componentWidth < 940,
      'large': this.state.componentWidth >= 940
    });

    var screen;

    //For IE10, use the start screen and that's it.
    if (Utils.isIE10()){
      if (this.state.screenToShow == CONSTANTS.SCREEN.START_SCREEN){
        screen = (<StartScreen {...this.props} contentTree={this.state.contentTree} />);
      }
      else {
        screen = (<div></div>);
      }
    }
    //switch screenToShow
    else {
      switch (this.state.screenToShow) {
        case CONSTANTS.SCREEN.LOADING_SCREEN:
          screen = (
            <Spinner />
          );
          break;
        case CONSTANTS.SCREEN.START_SCREEN:
          screen = (
            <StartScreen {...this.props} contentTree={this.state.contentTree} />
          );
          break;
        case CONSTANTS.SCREEN.PLAYING_SCREEN:
          screen = (
            <PlayingScreen {...this.props}
              contentTree={this.state.contentTree}
              currentPlayhead={this.state.currentPlayhead}
              duration={this.state.duration}
              buffered={this.state.buffered}
              fullscreen={this.state.fullscreen}
              playerState={this.state.playerState}
              seeking={this.state.seeking}
              upNextInfo={this.state.upNextInfo}
              authorization={this.state.authorization}
              controlBarAutoHide={this.props.skinConfig.controlBar.autoHide}
              ref="playScreen" />
          );
          break;
        case CONSTANTS.SCREEN.SHARE_SCREEN:
          screen = (
            <ShareScreen {...this.props}
              contentTree={this.state.contentTree}
              currentPlayhead={this.state.currentPlayhead}
              duration={this.state.duration}
              buffered={this.state.buffered}
              fullscreen={this.state.fullscreen}
              playerState={this.state.playerState}
              seeking={this.state.seeking}
              ref="shareScreen" />
          );
          break;
        case CONSTANTS.SCREEN.PAUSE_SCREEN:
          screen = (
            <PauseScreen {...this.props}
              contentTree={this.state.contentTree}
              currentPlayhead={this.state.currentPlayhead}
              playerState={this.state.playerState}
              duration={this.state.duration}
              buffered={this.state.buffered}
              pauseAnimationDisabled = {this.state.pauseAnimationDisabled}
              fullscreen={this.state.fullscreen}
              seeking={this.state.seeking}
              upNextInfo={this.state.upNextInfo}
              authorization={this.state.authorization}
              ref="pauseScreen" />
          );
          break;
        case CONSTANTS.SCREEN.END_SCREEN:
          screen = (
            <EndScreen {...this.props}
              contentTree={this.state.contentTree}
              discoveryData={this.state.discoveryData}
              currentPlayhead={this.state.currentPlayhead}
              duration={this.state.duration}
              buffered={this.state.buffered}
              fullscreen={this.state.fullscreen}
              playerState={this.state.playerState}
              seeking={this.state.seeking}
              authorization={this.state.authorization}
              ref="endScreen" />
          );
          break;
        case CONSTANTS.SCREEN.AD_SCREEN:
          screen = (
            <AdScreen {...this.props}
              contentTree={this.state.contentTree}
              currentAdsInfo={this.state.currentAdsInfo}
              currentPlayhead={this.state.currentPlayhead}
              fullscreen={this.state.fullscreen}
              playerState={this.state.playerState}
              duration={this.state.duration}
              adVideoDuration={this.props.controller.state.adVideoDuration}
              buffered={this.state.buffered}
              seeking={this.state.seeking}
              controlBarAutoHide={this.props.skinConfig.controlBar.autoHide}
              ref="adScreen" />
          );
          break;
        case CONSTANTS.SCREEN.DISCOVERY_SCREEN:
          screen = (
            <DiscoveryScreen {...this.props}
              contentTree={this.state.contentTree}
              currentPlayhead={this.state.currentPlayhead}
              duration={this.state.duration}
              buffered={this.state.buffered}
              discoveryData={this.state.discoveryData}
              playerState={this.state.playerState}
              fullscreen={this.state.fullscreen}
              seeking={this.state.seeking}
              responsiveView={responsiveClass}
              componentWidth={this.state.componentWidth}
              ref="DiscoveryScreen" />
          );
          break;
        case CONSTANTS.SCREEN.MORE_OPTIONS_SCREEN:
          screen = (
            <MoreOptionsScreen {...this.props}
              contentTree={this.state.contentTree}
              currentPlayhead={this.state.currentPlayhead}
              duration={this.state.duration}
              playerState={this.state.playerState}
              fullscreen={this.state.fullscreen}
              seeking={this.state.seeking}
              ref="moreOptionsScreen" />
          );
          break;
        case CONSTANTS.SCREEN.CLOSEDCAPTION_SCREEN:
          screen = (
            <ClosedCaptionScreen {...this.props}
              contentTree={this.state.contentTree}
              closedCaptionOptions = {this.props.closedCaptionOptions}
              currentPlayhead={this.state.currentPlayhead}
              duration={this.state.duration}
              buffered={this.state.buffered}
              playerState={this.state.playerState}
              fullscreen={this.state.fullscreen}
              seeking={this.state.seeking}
              responsiveView={responsiveClass}
              componentWidth={this.state.componentWidth}
              ref="closedCaptionScreen" />
          );
          break;
        case CONSTANTS.SCREEN.ERROR_SCREEN:
          screen = (
            <ErrorScreen {...this.props}
              errorCode={this.props.controller.state.errorCode} />
          );
          break;
        default:
          screen = (<div></div>);
      }
    }

    return (
      <div className={responsiveClass}>
        {screen}
      </div>
    );
  }
});
module.exports = Skin;