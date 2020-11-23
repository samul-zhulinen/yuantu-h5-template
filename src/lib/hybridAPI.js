import Hybrid from './Hybrid';

const HybridApi = {
  //打开页面
  openView: function(url, animation) {
    //bottom-in right-in
    return new Hybrid('openView', { url: url, animation: animation }).send();
  },

  /**
   * 控制顶部栏中的按钮显示
   * @param {string} type 枚举值: 'close' 叉叉按钮,'loading' 加载图标
   * @param {boolean} show 枚举值: true 显示 , false 不显示
   */
  controlTitleBar: function(type, show) {
    return new Hybrid('controlTitleBar', { type, show }).send();
  },
};

export default HybridApi;
