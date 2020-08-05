import {notification} from 'antd'

const operNotification = ({type, message, description}) => {
  notification[type]({
    message,
    description
  });
}

export default operNotification