import React from 'react';
import AnVideoProgressBar from './AnVideoProgressBar.react';
import AVideoControlPanelButtons from './AVideoControlPanelButtons.react';
import FunctionUtil from '../utils/FunctionUtil';

const THRESHOLD = 7.0;

export default class AVideoControlPanel extends React.Component {

    static propTypes = {
        position: React.PropTypes.string,
        width: React.PropTypes.number,
        duration: React.PropTypes.number,
        currentTime: React.PropTypes.number,
        currentState: React.PropTypes.string
    }

    constructor(props) {
        super(props);
        this._isShowing = true;
        this._hasToggle = false;
    }

    componentDidMount() {
        window.addEventListener('devicemotion', this._handleGravity);
    }

    componentWillUnmount() {
        window.removeEventListener('devicemotion', this._handleGravity);
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return FunctionUtil.contextShallowCompare(this, nextProps, nextState, nextContext);
    }

    _handleGravity = (event) => {
        const strength = Math.abs(event.accelerationIncludingGravity.y);
        if (strength > THRESHOLD) {
            if (!this._hasToggle) {
                this._hasToggle = true;
                this._isShowing = !this._isShowing;

                this.refs.root.emit(this._isShowing ? 'toggleShow' : 'toggleHide');
            }
            return;
        }
        this._hasToggle = false;
    }

    render() {
        const {
            currentTime,
            position,
            duration,
            currentState
        } = this.props;

        return (
            <a-entity
                ref='root'
                position={position}
                stereo='eye: both; isVideo: false;'
            >
                <AVideoControlPanelButtons
                    position="0 0.5 0"
                    currentState={currentState}
                />
                <AnVideoProgressBar
                    position='0 -0.5 0'
                    width={3}
                    currentTime={currentTime}
                    duration={duration}
                />
                <a-animation
                    begin='toggleHide'
                    attribute='position'
                    dur='500'
                    fill='forwards'
                    to='0 0 3'
                />
                <a-animation
                    begin='toggleShow'
                    attribute='position'
                    dur='500'
                    fill='forwards'
                    to={position}
                />
            </a-entity>
        );
    }
}
