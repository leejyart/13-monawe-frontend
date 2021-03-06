import React, { Component } from "react";
import { API_KM } from "../../Config";
import "./JoinStepTwo.scss";

class JoinStep2 extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      account: "",
      password: "",
      email: "",
      phone_number: "",
      date_of_birth: 19951116,
      email_agreement: false,
      sms_agreement: false,
      confirmPw: "",
      isPwInfoValid: true,
      isPasswordSame: true,
      isNameNull: false,
      isAccountNull: false,
      isPasswordNull: false,
      isEmailNull: false,
      isPhoneNumberNull: false
    };
  }

  handleInput = e => {
    e.preventDefault();
    const { value, name } = e.target;
    this.setState({
      [name]: String(value)
    });
  };

  toggleCheckbox = e => {
    const { sms_agreement, email_agreement } = this.state;
    this.setState({
      sms_agreement: !sms_agreement,
      email_agreement: !email_agreement
    });
  };

  checkId = e => {
    e.preventDefault();
    const APIforIdCheck = `${API_KM}/user/checkaccount`;
    const { account } = this.state;
    fetch(APIforIdCheck, {
      method: "POST",
      body: JSON.stringify({ account: account })
    })
      .then(response => response.json())
      .then(result => {
        result.message === "USER_ID_TAKEN"
          ? alert("이미 사용중인 아이디입니다.")
          : alert("사용 가능한 아이디입니다.");
      });
  };

  checkEmail = e => {
    e.preventDefault();
    const APIforEmailCheck = `${API_KM}/user/checkemail`;
    const { email } = this.state;
    fetch(APIforEmailCheck, {
      method: "POST",
      body: JSON.stringify({
        email: email
      })
    })
      .then(response => response.json())
      .then(result => {
        result.message === "USER_EMAIL_TAKEN"
          ? alert("이미 사용중인 이메일입니다.")
          : alert("사용 가능한 이메일입니다.");
      });
  };

  isPwInfoValid = () => {
    const { password } = this.state;
    const numberReg = /[0-9]/g;
    const characterReg = /[a-zA-z]/g;
    const specialCharacterReg = /\W|_/g;
    const isNumIncluded = password.match(numberReg) ? true : false;
    const isCharIncluded = password.match(characterReg) ? true : false;
    const isSpecialCharIncluded = password.match(specialCharacterReg)
      ? true
      : false;
    const isPwLong = password.length >= 6 && password.length <= 16;
    if (
      ((isNumIncluded && isSpecialCharIncluded) ||
        (isNumIncluded && isCharIncluded) ||
        (isCharIncluded && isSpecialCharIncluded)) &&
      isPwLong
    ) {
      this.setState({ isPwInfoValid: true });
    } else {
      this.setState({ isPwInfoValid: false });
    }
  };

  isPasswordSame = () => {
    const { password, confirmPw } = this.state;
    password !== confirmPw && this.setState({ isPasswordSame: false });
  };

  isInputNull = () => {
    const { name, account, password, email, phone_number } = this.state;
    name === ""
      ? this.setState({ isNameNull: true })
      : this.setState({ isNameNull: false });
    account === ""
      ? this.setState({ isAccountNull: true })
      : this.setState({ isAccountNull: false });
    password === ""
      ? this.setState({ isPasswordNull: true })
      : this.setState({ isPasswordNull: false });
    email === ""
      ? this.setState({ isEmailNull: true })
      : this.setState({ isEmailNull: false });
    phone_number === ""
      ? this.setState({ isPhoneNumberNull: true })
      : this.setState({ isPhoneNumberNull: false });
  };

  gotoPreviousStep = () => {
    this.props.history.push("/JoinStepOne");
  };

  checkValidation = e => {
    e.preventDefault();
    const {
      name,
      account,
      password,
      email,
      phone_number,
      date_of_birth,
      sms_agreement,
      email_agreement,
      isPwInfoValid,
      isPasswordSame
    } = this.state;
    const isEssentialInfoValid =
      name !== "" &&
      account !== "" &&
      password !== "" &&
      email !== "" &&
      phone_number !== "";
    const isIdValid = account.length >= 5 && account.length <= 16;
    this.isInputNull();
    this.isPasswordSame();
    this.isPwInfoValid();
    if (isEssentialInfoValid && isPasswordSame && isPwInfoValid && isIdValid) {
      const APIforRegister = `${API_KM}/user/signup`;
      fetch(APIforRegister, {
        method: "POST",
        body: JSON.stringify({
          name: name,
          account: account,
          password: password,
          email: email,
          phone_number: phone_number,
          date_of_birth: date_of_birth,
          sms_agreement: sms_agreement,
          email_agreement: email_agreement
        })
      })
        .then(response => response.json())
        .then(result => {
          if (result.message === "SIGNUP_SUCCESS") {
            alert("회원가입 완료");
            this.props.history.push("/JoinStepThree");
          }
        });
    }
  };

  render() {
    const {
      isNameNull,
      isAccountNull,
      isPasswordNull,
      isEmailNull,
      isPhoneNumberNull,
      isPasswordSame,
      isPwInfoValid
    } = this.state;
    return (
      <div className="JoinStepTwo">
        <h2>회원가입</h2>
        <div className="stepWrapper">
          <div className="step">
            <span>
              STEP1. 약관동의
              <i className="fas fa-chevron-right"></i>
            </span>
            <span className="currentStep">
              STEP2. 회원가입
              <i className="fas fa-chevron-right"></i>
            </span>
            <span>STEP3. 가입완료</span>
          </div>
          <div className="userInfoField">
            <div className="description">
              <h3>회원기본정보</h3>
              <p>*표시는 반드시 입력하셔야 하는 항목입니다.</p>
            </div>
            <form>
              <ul>
                <li>
                  <label>
                    <strong>이름 *</strong>
                    <input
                      name="name"
                      type="text"
                      placeholder="이름 입력"
                      maxLength="10"
                      onChange={this.handleInput}
                    ></input>
                  </label>
                  <div className={isNameNull ? "infoError" : "infoValid"}>
                    ⓘ 이름을 입력해주세요.
                  </div>
                </li>
                <li>
                  <label>
                    <strong>아이디 *</strong>
                    <div className="inputWrapper">
                      <input
                        name="account"
                        type="text"
                        placeholder="5~16자, 영문, 숫자 또는 영문+숫자 조합"
                        maxLength="16"
                        onChange={this.handleInput}
                      ></input>
                      <button onClick={e => this.checkId(e)}>중복확인</button>
                    </div>
                  </label>
                  <div className={isAccountNull ? "infoError" : "infoValid"}>
                    ⓘ 아이디를 입력해주세요.
                  </div>
                </li>
                <li>
                  <label>
                    <strong>비밀번호 *</strong>
                    <input
                      name="password"
                      type="password"
                      placeholder="영문/숫자/특수문자 중 2가지 조합, 6~16자 이내"
                      maxLength="10"
                      onChange={this.handleInput}
                    ></input>
                  </label>
                  <div className={isPasswordNull ? "infoError" : "infoValid"}>
                    ⓘ 비밀번호를 입력해주세요.
                  </div>
                  <div className={isPwInfoValid ? "infoValid" : "infoError"}>
                    ⓘ 입력한 비밀번호를 확인해 주세요.
                  </div>
                  <div className="pwGuideline">
                    * 6~16자 이내, 영문 대/소문자, 숫자, 특수문자 중 2가지
                    조합으로 사용해주세요.
                  </div>
                  <div className="pwGuideline">
                    * 아이디와 동일한 비밀번호는 사용할 수 없습니다.
                  </div>
                </li>
                <li>
                  <label>
                    <strong>비밀번호확인 *</strong>
                    <input
                      name="confirmPw"
                      type="password"
                      placeholder="비밀번호 재입력"
                      maxLength="10"
                      onChange={this.handleInput}
                    ></input>
                  </label>
                  <div className={isPasswordSame ? "infoValid" : "infoError"}>
                    ⓘ 입력한 비밀번호가 서로 일치하지 않습니다.
                  </div>
                </li>
                <li>
                  <label>
                    <strong>이메일 *</strong>
                    <div className="inputWrapper">
                      <input
                        name="email"
                        type="text"
                        placeholder="이메일 입력"
                        maxLength="50"
                        onChange={this.handleInput}
                      ></input>
                      <button onClick={e => this.checkEmail(e)}>
                        중복확인
                      </button>
                    </div>
                  </label>

                  <div className={isEmailNull ? "infoError" : "infoValid"}>
                    ⓘ 이메일을 입력해주세요.
                  </div>
                </li>
                <li>
                  <label>
                    <strong>휴대폰번호 *</strong>
                    <input
                      name="phone_number"
                      type="number"
                      placeholder="숫자만 입력(11자리)"
                      maxLength="11"
                      onChange={this.handleInput}
                    ></input>
                  </label>
                  <div
                    className={isPhoneNumberNull ? "infoError" : "infoValid"}
                  >
                    ⓘ 휴대폰번호를 입력해주세요.
                  </div>
                </li>
                <div className="optionalInfo">
                  <li>
                    <label>
                      <strong>생년월일</strong>
                      <input
                        name="date_of_birth"
                        type="number"
                        placeholder="숫자만 입력(8자리)"
                        maxLength="8"
                        onChange={this.handleInput}
                      ></input>
                    </label>
                  </li>
                  <li>
                    <div className="AgreementWrapper">
                      <strong>수신동의</strong>
                      <div className="txtAgreement">
                        <span>
                          <input
                            name="sms_agreement"
                            type="checkbox"
                            value="sms_agreement"
                            onChange={this.toggleCheckbox}
                          ></input>
                          <label htmlFor="sms_agreement">
                            SMS를 통한 상품 및 이벤트 정보 수신에 동의
                            합니다.[선택]
                          </label>
                        </span>
                        <span>
                          <input
                            name="email_agreement"
                            type="checkbox"
                            value="email_agreement"
                            onChange={this.toggleCheckbox}
                          ></input>
                          <label htmlFor="email_agreement">
                            이메일을 통한 상품 및 이벤트 정보 수신에 동의
                            합니다.[선택]
                          </label>
                        </span>
                        <p>
                          * SMS 및 이메일 수신동의와 무관하게 주문결제/회원 관련
                          안내 메일/문자는 발송되며 수신미동의 시 쇼핑몰 이용에
                          제약은 없습니다.
                        </p>
                      </div>
                    </div>
                  </li>
                </div>
              </ul>
              <div className="buttonArea">
                <button className="cancleBtn" onClick={this.gotoPreviousStep}>
                  취소
                </button>
                <button
                  className="confirmBtn"
                  onClick={e => this.checkValidation(e)}
                >
                  확인
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default JoinStep2;
