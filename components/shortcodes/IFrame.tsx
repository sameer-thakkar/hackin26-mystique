import React from 'react';

type IFrame = {
    name?: string;
    src: string;
    width?: number | string;
    height?: number | string;
    frameborder?: number | string;
    allow?: string;
    allowfullscreen?: string;
};

const IFrame: React.FC<IFrame> = ({
    name,
    src,
    width = 500,
    height = 500,
    frameborder = 0,
    allow = '',
    allowfullscreen = 'false',
}) => {
    const allowFullScreen = allowfullscreen === 'false' ? false : true;
    if (!src) {
        return null;
    }
    return (
        <>
            <div className="iframe-container">
                <iframe
                    name={name}
                    src={src}
                    width={Number(width)}
                    height={Number(height)}
                    frameBorder={Number(frameborder)}
                    allow={allow}
                    allowFullScreen={allowFullScreen}
                />
            </div>
            <style jsx>
                {`
                    .iframe-container {
                        position: relative;
                        padding-bottom: 56.25%;
                        padding-top: 35px;
                        height: 0;
                        overflow: hidden;
                    }
                    .iframe-container iframe {
                           position: absolute;
                           top: 0;
                           left: 0;
                           width: 100%;
                           height: 100%;
                    }
                `}
            </style>
        </>
    );
};

export default IFrame;
