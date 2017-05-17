package com.google.account.filter;

import java.io.Serializable;

public class SessionInfo implements Serializable {
  private static final long serialVersionUID = 1L;
  private long nonce;
  private long userId;
  private long expiresAt;


  public SessionInfo() {
    this(0, 0, 0);
  }

  public SessionInfo(long userId, long expiresAt, long nonce) {
    this.userId = userId;
    this.expiresAt = expiresAt;
    this.nonce = nonce;
  }

  public long getUserId() {
    return userId;
  }

  public void setUserId(long userId) {
    this.userId = userId;
  }

  public long getExpiresAt() {
    return expiresAt;
  }

  public void setExpiresAt(long expiresAt) {
    this.expiresAt = expiresAt;
  }

  public long getNonce() {
    return nonce;
  }

  public void setNonce(long nonce) {
    this.nonce = nonce;
  }
}
