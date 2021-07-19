

  // 起点
  var pointF0={
    x:60,
    y:400
  };
  //终点
  var pointF3={
    x:60,
    y:0
  };
  //point1, point2两个控制点
  function evaluate(time, point1, point2){
      let timeLeft = 1 - time;
      // 贝塞尔公式
      point.x = timeLeft * timeLeft * timeLeft * (point0.x)
              + 3 * timeLeft * timeLeft * time * (pointF1.x)
              + 3 * timeLeft * time * time * (pointF2.x)
              + time * time * time * (point3.x);

      point.y = timeLeft * timeLeft * timeLeft * (point0.y)
              + 3 * timeLeft * timeLeft * time * (pointF1.y)
              + 3 * timeLeft * time * time * (pointF2.y)
              + time * time * time * (point3.y);

      return point;
  }
 function getPointF(cale,mWidth,mHeight) {

    let pointF ={};
    //减去100 是为了控制 x轴活动范围
    pointF.x = random.nextInt((mWidth - 100));
    //再Y轴上 为了确保第二个控制点 在第一个点之上,我把Y分成了上下两半
    pointF.y = random.nextInt((mHeight - 100)) / scale;
    return pointF;
}