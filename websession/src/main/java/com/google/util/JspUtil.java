package com.google.util;

import javax.servlet.http.HttpServletRequest;

import com.google.common.base.Strings;

public class JspUtil {
  public static boolean isNullOrEmpty(String value) {
    return Strings.isNullOrEmpty(value);
  }

  public static String nullToEmpty(String value) {
    return Strings.isNullOrEmpty(value) ? "" : value;
  }

  public static String nullSafeGetParameter(HttpServletRequest request, String parameter) {
    return nullToEmpty(request.getParameter(parameter));
  }

  public static String nullSafeGetAttribute(HttpServletRequest request, String parameter) {
    return nullToEmpty((String) request.getAttribute(parameter));
  }
}
