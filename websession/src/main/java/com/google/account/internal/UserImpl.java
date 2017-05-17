package com.google.account.internal;

import java.io.Serializable;

import com.google.account.User;

public class UserImpl implements User, Serializable {
  private static final long serialVersionUID = 1L;

  private long uid;
  private String displayName;
  private String email;
  private String photoUrl;
  private boolean tosAccepted;
  private long lastBigChangeTime;


  @Override
  public long getUid() {
    return uid;
  }

  public void setUid(long uid) {
    this.uid = uid;
  }

  @Override
  public String getDisplayName() {
    return displayName;
  }

  public void setDisplayName(String displayName) {
    this.displayName = displayName;
  }

  @Override
  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  @Override
  public String getPhotoUrl() {
    return photoUrl;
  }

  public void setPhotoUrl(String photoUrl) {
    this.photoUrl = photoUrl;
  }

  @Override
  public boolean isTosAccepted() {
    return tosAccepted;
  }

  public void setTosAccepted(boolean tosAccepted) {
    this.tosAccepted = tosAccepted;
  }

  @Override
  public long getLastBigChangeTime() {
    return lastBigChangeTime;
  }

  public void setLastBigChangeTime(long lastBigChangeTime) {
    this.lastBigChangeTime = lastBigChangeTime;
  }
}
