let expression = [" "];

function pushToExpr(str) {
  if (document.getElementById("calc_result").textContent !== "0") {
    if (expression[expression.length - 1] === ")") {
      expression.push("*");
      document.getElementById("calc_expression").textContent += "*";
    }
    expression.push(document.getElementById("calc_result").textContent);
    expression.push(str);
    document.getElementById("calc_expression").textContent +=
      str + document.getElementById("calc_result").textContent;
    document.getElementById("calc_result").textContent = "0";
  } else if (str === "-") {
    expression.push(str);
    document.getElementById("calc_expression").textContent = str;
  } else if (/[ \-\+\/\*\%/(]/.test(expression[expression.length - 1])) {
    if (str === "(" || str === ")") {
      expression.push(str);
      document.getElementById("calc_expression").textContent = str;
    }
  } else {
    expression.push(str);
    document.getElementById("calc_expression").textContent = str;
  }
  document.getElementById("calc_expression").innerHTML = expression.join("");
  //console.log(expression);
}

function pushToRes(str) {
  if (/[ \-\+\/\*\%\(\)]/.test(expression[expression.length - 1])) {
    if (document.getElementById("calc_result").textContent === "0") {
      document.getElementById("calc_result").textContent = str;
    } else {
      document.getElementById("calc_result").textContent += str;
    }
  }
}

function evaluateExpression() {
  if (document.getElementById("calc_result").textContent !== "0") {
    expression.push(document.getElementById("calc_result").textContent);
    document.getElementById("calc_expression").innerHTML = expression.join("");
  }

  let result = eval(expression.join("")).toString();
  let dec = result.indexOf(".");
  if (dec !== -1) {
    result = result.substr(0, Math.min(result.length - 1, dec + 7));
  }

  document.getElementById("calc_result").textContent = result;
  expression = [" "];
}

document.getElementById("calc_b_pi").addEventListener("click", function(el) {
  pushToRes(Math.PI.toString().substr(0, 7));
});

document.getElementById("calc_b_euler").addEventListener("click", function(el) {
  pushToRes(Math.E.toString().substr(0, 7));
});

document
  .getElementById("calc_b_delete")
  .addEventListener("click", function(el) {
    if (document.getElementById("calc_result").textContent !== "0") {
      let num = document.getElementById("calc_result").textContent;
      document.getElementById("calc_result").textContent = num.substr(
        0,
        num.length - 1
      );
      if (document.getElementById("calc_result").textContent === "")
        document.getElementById("calc_result").textContent = "0";
    } else if (document.getElementById("calc_expression").textContent !== "") {
      // Removes either a single operator or a complete number from the expression
      expression.pop();
      document.getElementById("calc_expression").innerHTML = expression.join(
        ""
      );
    }
  });

document.getElementById("calc_b_clear").addEventListener("click", function(el) {
  expression = [" "];
  document.getElementById("calc_expression").textContent = " ";
  document.getElementById("calc_result").textContent = "0";
});

document
  .getElementById("calc_b_lparen")
  .addEventListener("click", function(el) {
    // console.log(/[ \-\+\/\*\%]/.test(expression[expression.length - 1]));
    if (
      document.getElementById("calc_result").textContent !== "0" ||
      /[^\-\+\/\*\%]/.test(expression[expression.length - 1])
    )
      pushToExpr("*");
    pushToExpr("(");
  });

document
  .getElementById("calc_b_rparen")
  .addEventListener("click", function(el) {
    let expr = document.getElementById("calc_expression").textContent;
    let p = expr.match(/\(/g);
    let q = expr.match(/\)/g);
    // console.log(p, " ", q);
    if (p === null || (q !== null && p.length <= q.length)) {
      let num = document.getElementById("calc_result").textContent;
      document.getElementById("calc_result").textContent =
        "Error: Unbalanced Parens";
      setTimeout(function() {
        document.getElementById("calc_result").textContent = num;
      }, 500);
    } else if (
      document.getElementById("calc_result").textContent !== "0" ||
      /[^\-\+\/\*\%]/.test(expression[expression.length - 1])
    ) {
      pushToExpr(")");
    }
  });

document
  .getElementById("calc_b_modulus")
  .addEventListener("click", function(el) {
    pushToExpr("%");
  });

document.getElementById("calc_b_div").addEventListener("click", function(el) {
  pushToExpr("/");
});

document.getElementById("calc_b_mult").addEventListener("click", function(el) {
  pushToExpr("*");
});

document.getElementById("calc_b_sub").addEventListener("click", function(el) {
  pushToExpr("-");
});

document.getElementById("calc_b_add").addEventListener("click", function(el) {
  pushToExpr("+");
});

document
  .getElementById("calc_b_equals")
  .addEventListener("click", function(el) {
    evaluateExpression();
  });

document
  .getElementById("calc_b_decimal")
  .addEventListener("click", function(el) {
    if (document.getElementById("calc_result").textContent === "0")
      pushToRes("0.");
    else if (!/[.]/.test(document.getElementById("calc_result").textContent))
      pushToRes(".");
  });

document.getElementById("calc_b_0").addEventListener("click", function(el) {
  if (document.getElementById("calc_result").textContent === "0")
    pushToRes("0.");
  else pushToRes("0");
});

document.getElementById("calc_b_1").addEventListener("click", function(el) {
  pushToRes("1");
});

document.getElementById("calc_b_2").addEventListener("click", function(el) {
  pushToRes("2");
});

document.getElementById("calc_b_3").addEventListener("click", function(el) {
  pushToRes("3");
});

document.getElementById("calc_b_4").addEventListener("click", function(el) {
  pushToRes("4");
});

document.getElementById("calc_b_5").addEventListener("click", function(el) {
  pushToRes("5");
});

document.getElementById("calc_b_6").addEventListener("click", function(el) {
  pushToRes("6");
});

document.getElementById("calc_b_7").addEventListener("click", function(el) {
  pushToRes("7");
});

document.getElementById("calc_b_8").addEventListener("click", function(el) {
  pushToRes("8");
});

document.getElementById("calc_b_9").addEventListener("click", function(el) {
  pushToRes("9");
});
