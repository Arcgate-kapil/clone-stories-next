import React from 'react';

import Player from './components/react-hls-player';

class ReactHlsPlayer extends React.Component {

    render () {
        let { url } = this.props;

        return <Player loop={true} width="100%" height="auto" playerRef={this.playerRef} url={url} {...this.props} />
    }
}

export default ReactHlsPlayer;

//ReactDOM.render(<Index />, document.getElementById('container'));
