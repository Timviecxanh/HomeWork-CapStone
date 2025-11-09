class Validate {
  khongtrong(value, errorId, mess) {
    if (value === "") {
      document.getElementById(errorId).style.display = "block";
      document.getElementById(errorId).innerHTML = mess;
      return false;
    }
    document.getElementById(errorId).style.display = "none";
    document.getElementById(errorId).innerHTML = "";

    return true;
  }

  checkLength(value, errorId, mess, min, max) {
    if (value && min <= value.trim().length && value.trim().length <= max) {
      //đúng
      document.getElementById(errorId).style.display = "none";
      document.getElementById(errorId).innerHTML = "";
      return true;
    }
    //sai
    document.getElementById(errorId).style.display = "block";
    document.getElementById(errorId).innerHTML = mess;
    return false;
  }

  checknumber(value, errorId, mess) {
    let letter = /^[0-9]+$/;

    if (value.match(letter)) {
      //đúng
      document.getElementById(errorId).style.display = "none";
      document.getElementById(errorId).innerHTML = "";
      return true;
    }
    //sai
    document.getElementById(errorId).style.display = "block";
    document.getElementById(errorId).innerHTML = mess;
    return false;
  }

  checksoduong(value, errorId, mess) {
    if (value > 0) {
      //đúng
      document.getElementById(errorId).style.display = "none";
      document.getElementById(errorId).innerHTML = "";
      return true;
    }
    //sai
    document.getElementById(errorId).style.display = "block";
    document.getElementById(errorId).innerHTML = mess;
    return false;
  }

  checkOption(idSelect, errorId, mess) {
    //selectIndex xuất ra index chọn
    const optionIndex = document.getElementById(idSelect).selectedIndex;
    if (optionIndex === 0) {
      document.getElementById(errorId).style.display = "block";
      document.getElementById(errorId).innerHTML = mess;
      return false;
    }

    document.getElementById(errorId).style.display = "none";
    document.getElementById(errorId).innerHTML = "";
    return true;
  }
}

export default Validate;
