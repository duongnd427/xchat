import Head from 'next/head';
import React from 'react';

export default class Template extends React.Component {
    render() {
        return (
            <div>
                <Head>
                    <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes" />
                    <meta httpEquiv="X-UA-Compatible" content="IE=100" />
                    <meta content="telephone=no" name="format-detection" />
                    <meta httpEquiv="expires" content="0" />
                    <meta httpEquiv="content-language" content="vi" />
                    <meta name="author" content="Xgaming.vn" />
                    <meta name="dc.rights.copyright" content="Xgaming"/>
                    <meta name="copyright" content="Xgaming.vn" />
                    <meta name="keywords" content="Video, Livestream, Live, Streamer, Game, Chơi game, Xem game, Mocha gaming, Viettel game, Hướng dẫn game, Liên quân, PUBG, CS Go, Free Fire, AOE." />
                    <meta name="revisit" content="1 days" />
                    <meta name="language" content="vi-VN" />
                    <meta name="geo.country" content="VN" />
                    <meta name="geo.region" content="VN-HN" />
                    <meta name="geo.placename" content="Hà Nội" />
                    <meta name="geo.position" content="21.033333;105.85" />
                    <meta name="dc.publisher" content="Xgaming.vn" />
                    <meta name="dc.identifier" content="Xgaming.vn" />
                    <meta name="dc.creator.name" content="Xgaming"/>
                    <meta name="dc.creator.email" content="hoptac@viettel.com.vn"/>
                    <meta name="dc.language" content="vi-VN" />
                    <meta name="dc.keywords"  content="Video, Livestream, Live, Streamer, Game, Chơi game, Xem game, Mocha gaming, Viettel game, Hướng dẫn game, Liên quân, PUBG, CS Go, Free Fire, AOE." />
                    <meta name="news_keywords" content="Video, Livestream, Live, Streamer, Game, Chơi game, Xem game, Mocha gaming, Viettel game, Hướng dẫn game, Liên quân, PUBG, CS Go, Free Fire, AOE." />
                    <meta name="google-site-verification" content="VZbLE55-SU3yAO7BjXrJqJdRe28cY__LXIU9YoWgjCE" />
                    <title>Xgaming - Cộng đồng cho người yêu thích game</title>
                    <link rel="shortcut icon" href="/hnet.com-image.ico" />
                    <meta name="apple-mobile-web-app-capable" content="yes" />
                    <meta name="apple-mobile-web-app-status-bar-style" content="black" />

                    <meta name="robots" content="index,follow,noodp" />
                    <meta name="robots" content="noarchive" />
                    <meta name="googlebot" content="index,follow" />
                    <meta name="revisit-after" content="days" />
                    <link rel="alternate" href="http://xgaming.vn/" hrefLang="vi-vn"/>
                    {/*Open app*/}
                    <meta name="al:ios:app_store_id" property="al:ios:app_store_id" content="1522806910" data-app />
                    <meta name="al:ios:app_name" property="al:ios:app_name" content="Xgaming" data-app />
                    <meta name="al:ios:url" property="al:ios:url" content="xgaming://tab/home" data-app />
                    <meta name="al:android:app_name" property="al:android:app_name" content="Xgaming" data-app />
                    <meta name="al:android:package" property="al:android:package" content="com.viettel.xgaming.app" data-app />
                    <meta name="al:android:url" property="al:android:url" content="xgaming://tab/home" data-app />


                    <meta property="og:type" content="website" />
                    <meta property="fb:app_id" content="482452638561234"/>
                    <meta property="fb:admins" content="482452638561234" />
                    {/*End open app */}

                    {/* Twitter Card */}
                    <meta name="twitter:card" value="summary" />
                    <meta name="twitter:site" content="@MochaOnline"/>
                    <meta name="twitter:creator" content="@MochaOnline"/>
                    {/* End Twitter Card */}

                </Head>
                <div id="wraper">
                    <div id="app">
                        {this.props.children}
                    </div>
                </div>
            </div>
        )
    }

}

