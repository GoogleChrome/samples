<%@ page language="java" contentType="text/html; charset=iso-8859-1" %>
<%@ page import="com.google.util.JspUtil" %>
<%@ page import="com.google.config.UrlConfig" %>
<%
  String error = JspUtil.nullSafeGetAttribute(request, "error");
  String errorMessage = null;
  boolean showError = true;
  if ("WRONG_PASSWORD".equals(error)) {
    errorMessage = "Wrong email and password combination.";
  } else if (!JspUtil.isNullOrEmpty(error)) {
    errorMessage = "Unknown error: " + error;
  } else {
    showError = false;
  }

  String email = JspUtil.nullSafeGetParameter(request, "email");
  String app = JspUtil.nullSafeGetParameter(request, "app");
  String continueUrl = JspUtil.nullSafeGetParameter(request, "continueUrl");
%>
<html>
<head>
<title>Sign In</title>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
<link rel="stylesheet" type="text/css" href="/account/css/ui.css" />
</head>
<body>
<h2>Log in to <%= request.getServerName() %></h2>
<div id="login-box">
  <div id="login-box-inner">
    <form method="POST" action="<%=UrlConfig.LOGIN_ACTION%>">
    <input type=hidden name=continueUrl value='<%= continueUrl %>'>
    <% if (showError) { %>
      <div class="error"><%= errorMessage %></div>
    <% } %>
    <p>
      User<br>
      <input type="text" class="input-box" value="<%= email %>" name="email" autocomplete="off">
    </p>
    <p>Password<br><input type="password" class="input-box" name="password" autocomplete="off"></p>
    <p></p><center><input type="submit" value="Sign In" class="input-button"></center><p></p>
    <p></p><center><a href="<%= UrlConfig.SIGNUP_PAGE %>" class="new-account">Create a new account</a></center><p></p>
    </form>
  </div>
</div>
</body>
</html>