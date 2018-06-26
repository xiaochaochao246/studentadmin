var code;
function createCode() {
    code = new Array();
    var codeLength = 4;
    var checkCode = document.getElementById("checkCodes");
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
    var verifyCode = document.getElementById("verifyCodes").value.toUpperCase();
    var checkCode = document.getElementById("checkCodes").value;
    var stuID = document.getElementById("stuID").value;
    var stuPwd = document.getElementById("stuPwd").value;
    if(stuID==""){
        alert("学号不能为空")
    }else if(stuPwd==""){
        alert("密码不能为空")
    }else if(verifyCode==null|verifyCode!=checkCode){
        alert("验证码输入错误！");
        document.getElementById("verifyCodes").focus();
        createCode();//刷新验证码
        return true;
    }else{
        document.getElementById("form2").submit();
    }
}