require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

//let yeomanImage = require('../images/yeoman.png');

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

/**
 * 获取区间内的随机值
 * @param low
 * @param height
 */
function getRangeRandom(low,height){
	return Math.ceil(Math.random()*(height-low)+low);
}
var ImageFigure = React.createClass({

	render:function(){
		var styleObj = {};
		//如果props属性中指定了位置
		if(this.props.arrange.pos){
			styleObj = this.props.arrange.pos;
		}

		return(
			<figure className="img-figure" style={styleObj} ref="figure">
				<img src={this.props.data.imageURL}
					alt={this.props.data.title}
					/>
				<figcaption>
					<h2 className="img-title">{this.props.data.title}</h2>
				</figcaption>
			</figure>
		)
	}
})

var AppComponent = React.createClass ({

	Constant: {
		centerPos: {
			left: 0,
			right: 0
		},
		hPosRange: {     //水平方向取值范围
			leftSecX: [0, 0],
			rightSecX: [0, 0],
			y: [0, 0]
		},
		vPosRange: {     //垂直方向的取值范围
			x: [0, 0],
			topY: [0, 0]
		}
	},
	/**
	 * 重新布局所有图片
	 * @param centerIndex 居中显示的图片索引
	 */
	rearrange:function(centerIndex){
		var imageArrangeArr = this.state.imageArrangeArr,
				Constant = this.Constant,
				centerPos = Constant.centerPos,
				hPosRange = Constant.hPosRange,
				vPosRange = Constant.vPosRange,
				hPosRangeLeftSecX = hPosRange.leftSecX,
				hPosRangeRightSecX = hPosRange.rightSecX,
				hPosRangeY = hPosRange.y,
				vPosRangeTopY = vPosRange.topY,
				vPosRangeX = vPosRange.x,

			imgsArrangeTopArr = [],
			topImgNum = Math.ceil(Math.random()*2),//去一个或不去

			topImgSplieIndex = 0,
			imgsArrangeCenterArr = imageArrangeArr.splice(centerIndex,1);

			//中心图片的位置信心
			imgsArrangeCenterArr[0].pos = centerPos;

		//布局上部份的图片显示
		topImgSplieIndex = Math.ceil(Math.random()*imageArrangeArr.length-topImgNum);
		imgsArrangeTopArr = imageArrangeArr.slice(topImgSplieIndex,topImgNum);
		
		imgsArrangeTopArr.forEach(function (valur,index) {

			imgsArrangeTopArr[index].pos={
				top:getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
				left:getRangeRandom(vPosRangeX[0],vPosRangeX[1])
			};
		})

		//布局左右两侧的图片显示
		for(var i = 0,j=imageArrangeArr.length,k=j/2;i<j;i++){
			var hPosRangeLORX = null;
			if(i<k){
				hPosRangeLORX = hPosRangeLeftSecX;
			}else{
				hPosRangeLORX = hPosRangeRightSecX;
			}
			imageArrangeArr[i].pos={
				top:getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
				left:getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
			};
		}

		if(imageArrangeArr && imgsArrangeTopArr[0]){
			imageArrangeArr.splice(topImgSplieIndex,0,imgsArrangeTopArr[0]);
		}
		imageArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);

		this.setState({
			imageArrangeArr:imageArrangeArr
		});
	},
	getInitialState:function(){
		console.log('init');
		return {
			imageArrangeArr:[
				{
					//pos:{
					//	left:'0',
					//	top:'0'
					//}
				}
			]
		};
	},
	componentDidMount:function(){
		var stage = this.refs.stage,
				stageW = stage.scrollWidth,
				stageH = stage.scrollHeight,
				halfStageW = Math.ceil(stageW /2),
				halfStageH = Math.ceil(stageH /2);

		var imgFigureDom = this.refs.imgFigure0.refs.figure,
				imgW = imgFigureDom.scrollWidth,
				imgH = imgFigureDom.scrollHeight,
				halfImgW = Math.ceil(imgW/2),
				halfImgH = Math.ceil(imgH/2);

		this.Constant.centerPos = {
			left:halfStageW-halfImgW,
			top:halfStageH-halfImgH
		}
		//计算左侧和右侧区域的取值范围
		this.Constant.hPosRange.leftSecX[0] = -halfImgW;
		this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW*3;
		this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
		this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;

		this.Constant.hPosRange.y[0] = -halfImgH;
		this.Constant.hPosRange.y[1] = stageH-halfImgH;

		//计算上侧区域的取值范围
		this.Constant.vPosRange.topY[0] = -halfImgH;
		this.Constant.vPosRange.topY[1] = halfStageH - halfImgH*3;
		this.Constant.vPosRange.x[0] = halfStageW - imgW;
		this.Constant.vPosRange.x[1] = halfStageW;

		this.rearrange(0);
	},

  render:function() {

	  var controllerUntil = [], imgFigures = [];

	    imageDatas.forEach(function (value,index) {
		    if(!this.state.imageArrangeArr[index]){
			    this.state.imageArrangeArr[index] = {
				    pos:{
					    left:0,
					    top:0
				    }
			    };
		    }
		    imgFigures.push(<ImageFigure data={value} key={index} ref={'imgFigure'+index} arrange={this.state.imageArrangeArr[index]}/>);
	    }.bind(this));

    return (
      <section className="stage" ref="stage">
	      <section className="img-sec">
		      {imgFigures}
	      </section>
	      <nav className="controller-nav">
		      {controllerUntil}
	      </nav>
      </section>
    );
  }
})


AppComponent.defaultProps = {

};

export default AppComponent;
