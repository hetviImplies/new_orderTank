import React, {Children} from 'react';
import PropTypes from 'prop-types';

import Context from './Context';
import Notification from './Notification';

class Provider extends React.PureComponent {
  constructor(props) {
    super(props);

    this.showNotification = this.showNotification.bind(this);
  }

  showNotification(notificationOptions) {
    if (this.notification) {
      this.notification.show(notificationOptions);
    }
  }

  render() {
    const {children} = this.props;
    return (
      <Context.Provider value={this.showNotification}>
        {Children.only(children)}
        <Notification
          ref={ref => {
            this.notification = ref;
          }}
          {...this.props}
          closeInterval={4500}
        />
      </Context.Provider>
    );
  }
}

Provider.propTypes = {
  ...Notification.propTypes,
  children: PropTypes.element.isRequired,
};

export default Provider;
