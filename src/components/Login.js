import React, { Component } from 'react';
import {Modal} from 'antd-mobile'
//import '../css/login.css';
import 'antd/dist/antd.css';
import { Form, Icon, Input, Button, notification, Checkbox } from 'antd';
// import { Link } from 'react-router-dom';
import axios from 'axios';
import GlobalUrl from '../contant/GlobalUrl'

const FormItem = Form.Item;

notification.config({
  placement: 'topRight',
  top: 5,
  duration: 3,
});

class Login extends Component {
  state={
    taskNum:0
  }

  render() {
    
    const AntWrappedLoginForm = Form.create()(NormalLoginForm)
    return (

      <div className="container" style={{width:'100%',height:'300',display:'flex',alignItems:'center'}}>
        <div className="login-container" style={{width:'100%',height:'30%',textAlign: "center"}}>
          <h1 className="page-title" >Dino停车系统</h1>
          <h1>登录页面</h1>
          <div className="login-content">
            <AntWrappedLoginForm onLogin={this.props.onLogin} />
          </div>
        </div>
      </div>

    );
  }
}

const openNotification = () => {
  notification['error']({
    message: 'Wrong userName or password',
    duration: 1,
    //description: 'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
    // icon: <Icon type="smile-circle" style={{ color: '#108ee9' }} />,
    style: {
      width: 350,
      marginLeft: 0 - 725,
    },
  });
};

class NormalLoginForm extends React.Component {
  constructor(props){
    super(props)
  }

  handleSubmit = (e) => {
    e.preventDefault();

    // window.location.href="home/RobOrder";
    this
      .props
      .form
      .validateFields((err, values) => {
        if (!err) {
          //  console.log('Received values of form: ', values);
          axios.post(`${GlobalUrl.request}/login`, {
            // axios.post("http://localhost:8081/login", {
            "username": values.userName,
            "password": values.password
          }).then(function (response) {
            // console.log(response.headers.authorization)
            // console.log(response.headers.cookies)
            // console.log(response.headers)
            const cookies = JSON.parse(response.headers.cookies)
            const token = response.headers.authorization
            localStorage.setItem("token", token);
            localStorage.setItem("id",cookies.id)
            // localStorage.setItem("role",cookies.role)
            localStorage.setItem("status",'1')
                
            window.location.href="home/RobOrder";
            //return (<Redirect to="/EmployeeManage" />);
           // this.props.history.push('/EmployeeManage')
          }).catch(function (error) {
            console.log(error)
            if(error.response.headers.cookies!==undefined&&!JSON.parse(error.response.headers.cookies).status){
              Modal.alert('您的账号已被冻结，无法登陆')
            }else{
              Modal.alert('账号密码错误')
            }
          
            // openNotification();
          })
        }
      });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Form onSubmit={this.handleSubmit} style={{maxWidth:'80%',margin:' 0 auto'}}>
          <FormItem>
            {getFieldDecorator('userName', {
              rules: [
                {
                  required: true,
                  message: 'Please input your username!'
                }
              ]
            })(
              <Input
                prefix={< Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="Username" />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('password', {
              rules: [
                {
                  required: true,
                  message: 'Please input your Password!'
                }
              ]
            })(
              <Input
                prefix={< Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                type="password"
                placeholder="Password" />
            )}
          </FormItem>
          <FormItem>
            {/* {getFieldDecorator('remember', {
              valuePropName: 'checked',
              initialValue: true
            })(
              <Checkbox>Remember me</Checkbox>
            )}
            <a className="login-form-forgot" href="">Forgot password</a> */}
            <Button type="primary" htmlType="submit" style={{width: '100%'}} >
              Login
          </Button>
          </FormItem>
        </Form>
      </div>

    );
  }
}

export default Login;
