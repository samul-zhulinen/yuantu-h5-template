import React from 'react';
import Lottie from 'react-lottie';
import util from '@util/util';
import hybridApi from '@lib/hybridAPI';
import animationData from '@assets/loading.json';
import styles from '@style/blockLoading.less';

export default class BlockLoading extends React.Component<any, any> {
  static defaultProps: { show: boolean; text: string; transparent: boolean };
  static getDerivedStateFromProps(props: any) {
    const { show } = props;
    if (util.isInYuantuApp()) {
      if (show) {
        hybridApi.controlTitleBar('loading', true);
      } else {
        hybridApi.controlTitleBar('loading', false);
      }
    }
    return {};
  }
  constructor(props: any) {
    super(props);
    this.state = {};
  }
  render() {
    const { show, text, transparent } = this.props;
    return (
      show && (
        <div className={styles['loading']}>
          <div
            className={styles['cover']}
            style={transparent ? { background: 'inherit' } : {}}
          ></div>
          <div className={styles['loadingLottie']}>
            <Lottie
              options={{
                loop: true,
                autoplay: true,
                animationData: animationData,
                rendererSettings: {
                  preserveAspectRatio: 'xMidYMid slice',
                },
              }}
            />
            <span style={{ fontSize: '14px', color: '#323438' }}>{text}</span>
          </div>
        </div>
      )
    );
  }
}

BlockLoading.defaultProps = {
  show: true,
  text: '',
  transparent: false,
};
