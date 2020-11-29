﻿using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ProjectListItem : MonoBehaviour {

    public string projectName;
    public string id;
    public int index;
    public UserHubManager manager;

    public void select()
    {
        manager.selectProject(this);
    }
}
