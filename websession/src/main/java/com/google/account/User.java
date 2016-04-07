package com.google.account;

import java.io.Serializable;

public interface User extends Serializable {

  long getUid();

  String getDisplayName();

  String getEmail();

  String getPhotoUrl();

  boolean isTosAccepted();

  long getLastBigChangeTime();
}
