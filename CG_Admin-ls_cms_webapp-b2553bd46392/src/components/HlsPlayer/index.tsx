import React, { ChangeEvent, FC, useEffect, RefObject } from "react";
import ReactHlsPlayer from 'react-hls-player';

interface HlsPlayerProps {
    hlsUrl: string
}


const HlsPlayer: FC<HlsPlayerProps> = (props) => {
    const playerRef = React.useRef() as RefObject<HTMLVideoElement>;

    return (
        <>
            <ReactHlsPlayer
                playerRef={playerRef}
                src={props.hlsUrl}
                hlsConfig={{
                    maxLoadingDelay: 4,
                    minAutoBitrate: 0,
                    lowLatencyMode: true,
                    xhrSetup: (xhr: XMLHttpRequest) => {
                        xhr.withCredentials = true;
                        xhr.setRequestHeader("Access-Control-Allow-Headers","Content-Type, Accept, X-Requested-With");
                        xhr.setRequestHeader("Access-Control-Allow-Origin","http://15.207.101.33:3000");
                        xhr.setRequestHeader("Access-Control-Allow-Credentials","true");
                    }
                }}
            />
        </>
    )
}

export default HlsPlayer;