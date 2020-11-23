import React from 'react';
import util from '@util/util';
import Patient from '@lib/Patient';
import { Icon } from 'ytu-mobile';
import styles from '@style/select-patient.less';
import { TRANSFER } from '../../config';

export default class selectPatient extends React.Component<any, any> {
  query: import('querystring').ParsedUrlQuery;

  constructor(props: any) {
    super(props);
    this.query = util.query();
    this.state = {
      patientId: '',
      patientName: '',
    };
  }

  componentDidMount() {
    const { onPatientChange } = this.props;
    const patientModule = new Patient();

    patientModule.register({
      fn: (data: any) => {
        const { patientId, patientName, name } = data;
        this.setState({ patientId, patientName: patientName || name });
        onPatientChange && onPatientChange(data);
      },
    });

    patientModule.init();
  }

  handleClick = () => {
    const { unionId, corpId } = this.query;

    const params = {
      unionId,
      corpId,
      selectView: 1,
      transferKey: 12,
      referrer: window.location.href,
      target: '_blank',
    };
    location.href = `${TRANSFER}${util.flat({ ...params })}`;
  };

  render() {
    const { patientName } = this.state;
    return (
      <div
        className={styles['select-patient']}
        onClick={() => this.handleClick()}
      >
        <span className={styles['select-patient-name']}>
          {patientName || '无'}
        </span>
        <Icon type="Bottom" width="11px" height="11px" color="#c4c7cc" />
      </div>
    );
  }
}
