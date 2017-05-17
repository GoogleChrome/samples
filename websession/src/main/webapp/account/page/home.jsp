<%@ page language="java" contentType="text/html; charset=iso-8859-1" %>
<%@ page import="com.google.config.UrlConfig" %>
<%@ page import="com.google.util.JspUtil" %>
<%@ page import="com.google.account.filter.FilterUtil" %>
<%@ page import="com.google.account.User" %>
<%@ page import="com.google.dosidos.data.SessionState" %>
<%@ page import="java.text.DateFormat" %>
<%@ page import="java.util.Date" %>
<%
  User user = FilterUtil.getSessionUser(request);

  String lastBigAccountChangeTime = "";
  long time = user.getLastBigChangeTime();
  if (time > 0) {
    DateFormat df = DateFormat.getDateTimeInstance();
    lastBigAccountChangeTime = df.format(new Date(time));
  }
  
  SessionState sessionState = (SessionState) request.getAttribute("login_session_state");
  request.removeAttribute("login_session_state");
%>
<html>
<head>
<title>Home Page</title>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
<link rel="stylesheet" type="text/css" href="/account/css/ui.css" />
<script src="/js/indexed-db.js"></script>
<script src="/js/settings.js"></script>
<script src="/js/install.js"></script>
<script>
function logout() {
  dosidos.store.clear().then(function() {
  	window.location = '<%=UrlConfig.LOGOUT_ACTION%>';
  });
}
</script>
</head>
<body>
<div id="reg_box">
  <div id="reg_area">
    <div style="text-align: left; font-size: 15px; color: #1C94C4; font-weight: bold; padding: 8px;">
      Welcome to <%= request.getServerName() %>, <%= user.getDisplayName() %>!
    </div>
    <div style="text-align: left; font-size: 13px; color: #999; padding: 0px 8px 20px 20px;">
      Below are your profile information:
    </div>
    <table cellpadding="1" cellspacing="0">
      <tbody>
        <tr style="vertical-align: top;">
          <td class="label"><label for="email">Your Email:</label></td>
          <td class="label">
            <input id="email" name="email" value='<%= user.getEmail() %>' type="text" readonly>
          </td>
        </tr>
        <tr style="vertical-align: top;">
          <td class="label"><label for="displayName">Display Name:</label></td>
          <td>
            <input id="displayName" name="displayName" value='<%= user.getDisplayName() %>' type="text" readonly>
          </td>
        </tr>
        <tr style="vertical-align: top;">
          <td class="label"><label for="photoUrl">Photo URL:</label></td>
          <td>
            <input id="photoUrl" name="photoUrl" value='<%= user.getPhotoUrl() %>' type="text" readonly>
          </td>
        </tr>
        <tr style="vertical-align: top;">
          <td class="label"><label for="big">Big Change Time:</label></td>
          <td>
            <input id="big" name="big" value='<%= lastBigAccountChangeTime %>' type="text" readonly>
          </td>
        </tr>
      </tbody>
    </table>
    <p>
    <table><tr><td>
    <table cellspacing="0" cellpadding="0" border="0" class="widget-button">
      <tbody>
        <tr>
          <td class="widget-button-left"></td>
          <td class="widget-button-middle">
            <a class="widget-button-link" href="<%=UrlConfig.HOME_PAGE%>">Refresh Page</a>
          </td>
          <td class="widget-button-right"></td>
        </tr>
      </tbody>
    </table>
    </td>
    <td style="font-size: 13px; color: #999;">
      Or <a href="<%=UrlConfig.BIG_CHAGNE_ACTION%>" style="font-size: 13px; color: #1C94C4;">Big Change</a>
    </td>
    <td style="font-size: 13px; color: #999;">
      Or <a href="" onclick="logout(); return false;" style="font-size: 13px; color: #1C94C4;">Logout</a>
    </td>
    </tr></table>
    </p>
  </div>
  </form>
</div>
<% if (sessionState != null) { %>
<script  type="text/javascript">
  dosidos.installServiceWorker(
      '/sw.js',
      '/',
      '<%= sessionState.getLatJwt() %>',
      <%= sessionState.getSatLifetime() %>)
</script>
<% } %>
</body>
</html>