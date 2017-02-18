require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';

let yeomanImage = require('../images/yeoman.png');

//获取图片相关数据
var imageDatas = require('../data/imageDatas.json');
//使用自执行，将图片信息转换为URL路径
imageDatas = (function genImageURL(images){
	for(var i = 0,j=images.length;i<j;i++){
		var singleImageData = images[i];
		singleImageData.imageURL = require('../images/'+singleImageData.fileName);
		images[i] = singleImageData;
	}
	return images;
})(imageDatas);

class AppComponent extends React.Component {

  render() {
    return (
      <section className="stage">
	      <section className="img-sec">
	      </section>
	      <nav className="controller-nav">
	      </nav>
      </section>
    );
  };
}


AppComponent.defaultProps = {

};

export default AppComponent;
