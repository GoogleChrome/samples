<%@ page language="java" contentType="text/html; charset=iso-8859-1" %>
<%@ page import="com.google.account.internal.storage.UserStore.SignupError" %>
<%@ page import="com.google.config.UrlConfig" %>
<%@ page import="com.google.util.JspUtil" %>
<%@ page import="java.util.Collections" %>
<%@ page import="java.util.List" %>
<%
  List<SignupError> errors = (List<SignupError>) request.getAttribute("errors");
  if (errors == null) {
    errors = Collections.emptyList();
  }
  String email = JspUtil.nullSafeGetParameter(request, "email");
  String displayName = JspUtil.nullSafeGetParameter(request, "displayName");
  String photoUrl = JspUtil.nullSafeGetParameter(request, "photoUrl");
%>
<html>
<head>
<title>Sign Up</title>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
<link rel="stylesheet" type="text/css" href="/account/css/ui.css" />
</head>
<body>
<div id="reg_box">
  <form method="post" action="<%= UrlConfig.SIGNUP_ACTION %>" name="regForm">
  <div id="reg_area">
    <div style="text-align: left; font-size: 15px; color: #1C94C4; font-weight: bold; padding: 8px;">
      Welcome to <%= request.getServerName() %>!
    </div>
    <div style="text-align: left; font-size: 13px; color: #999; padding: 0px 8px 20px 20px;">
      Please provide follow information to create your account.
    </div>
    <table cellpadding="1" cellspacing="0">
      <tbody>
        <tr style="vertical-align: top;">
          <td class="label"><label for="email">Your Email:</label></td>
          <td>
            <input id="email" name="email" value='<%= email %>' type="text" autocomplete="off">
            <% if (errors.contains(SignupError.INVALID_EMAIL)) { %>
              <div class="widget-error">Invalid email address.</div>
            <% } else if (errors.contains(SignupError.EMAIL_REGISTERED)) { %>
              <div class="widget-error">Email already registered.</div>
            <% } %>
          </td>
        </tr>
        <tr style="vertical-align: top;">
          <td class="label"><label for="displayName">Display Name:</label></td>
          <td>
            <input id="displayName" name="displayName" value='<%= displayName %>' type="text" autocomplete="off">
            <% if (errors.contains(SignupError.EMPTY_DISPLAY_NAME)) { %>
              <div class="widget-error">Display Name cannot be empty.</div>
            <% } %>
          </td>
        </tr>
        <tr style="vertical-align: top;">
          <td class="label"><label for="photoUrl">Photo URL:</label></td>
          <td>
            <input placeholder="/account/image/user1.jpg" id="photoUrl" name="photoUrl" value='<%= photoUrl %>' type="text" autocomplete="off">
            <img style="height:16px; width:16px; cursor:pointer;" src="/account/image/nophoto.png" onclick="document.getElementById('photoUrl').value='/account/image/nophoto.png'"></img>
            <img style="height:16px; width:16px; cursor:pointer;" src="/account/image/user1.jpg" onclick="document.getElementById('photoUrl').value='/account/image/user1.jpg'"></img>
            <img style="height:16px; width:16px; cursor:pointer;" src="/account/image/user2.jpg" onclick="document.getElementById('photoUrl').value='/account/image/user2.jpg'"></img>
          </td>
        </tr>
        <tr style="vertical-align: top;">
          <td class="label"><label for="password">Password:</label></td>
          <td>
            <input id="password" name="password" value="" type="password" autocomplete="off">
            <% if (errors.contains(SignupError.INVALID_PASSWORD)) { %>
              <div class="widget-error">The password length cannot be less than 3.</div>
            <% } %>
          </td>
        </tr>
        <tr style="vertical-align: top;">
          <td class="label"><label for="confirm">Re-enter Password:</label></td>
          <td>
            <input id="confirm" name="confirm" value="" type="password" autocomplete="off">
            <% if (errors.contains(SignupError.CONFIRM_MISMATCH)) { %>
              <div class="widget-error">Your passwords do not match.</div>
            <% } %>
          </td>
        </tr>
      </tbody>
    </table>
    <p>
    <table><tr><td>
    <table cellspacing="0" cellpadding="0" border="0" class="widget-button" onclick="regForm.submit();">
      <tbody>
        <tr>
          <td class="widget-button-left"></td>
          <td class="widget-button-middle">
            <a class="widget-button-link" onclick="return false;">Create Account</a>
          </td>
          <td class="widget-button-right"></td>
        </tr>
      </tbody>
    </table>
    </td>
    <td style="font-size: 13px; color: #999;">
      Or <a href="<%=UrlConfig.LOGIN_PAGE%>" style="font-size: 13px; color: #1C94C4;">Cancel</a>
    </td>
    </tr></table>
    </p>
  </div>
  </form>
</div>
</body>
</html>