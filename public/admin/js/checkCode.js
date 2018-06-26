var code;
function createCode() {
    code = new Array();
    var codeLength = 4;
    var checkCode = document.getElementById("checkCode");
    checkCode.value = "";
    var selectChar = new Array(2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D',
        'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R',
        'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z');
    for ( var i = 0; i < codeLength; i++) {
        var charIndex = Math.floor(Math.random() * 32);
        code += selectChar[charIndex];
    }
    if (code.length != codeLength) {
        createCode();
    }
    checkCode.value = code;
};

function validatecode(){
    var verifyCode = document.getElementById("verifyCode").value.toUpperCase();
    var checkCode = document.getElementById("checkCode").value;
    var username = document.getElementById("username").value;
    var pwd = document.getElementById("pwd").value;
    if(username==""){
        alert("用户名不能为空")
    }else if(pwd==""){
        alert("密码不能为空")
    }else if(verifyCode==null|verifyCode!=checkCode){
        alert("验证码输入错误！");
        document.getElementById("verifyCode").focus();
        createCode();//刷新验证码
        return true;
    }else{
        document.getElementById("form1").submit();
    }
}