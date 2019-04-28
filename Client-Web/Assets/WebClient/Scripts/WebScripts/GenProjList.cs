using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using Assets.RealityFlow.Scripts.Events;

public class GenProjList : MonoBehaviour {

    [SerializeField]
    private GameObject projOptionTemplate;

	// Use this for initialization
	void Start () {
        if (Config.projectList != null)
        {     
            foreach (FlowProject c in Config.projectList)
            {
                GameObject projOption = Instantiate(projOptionTemplate) as GameObject;
                projOption.SetActive(true);
                projOption.transform.SetParent(projOptionTemplate.transform.parent, false);

                projOption.GetComponent<grabProject>().id = c._id;

                projOption.transform.Find("Project Title").GetComponent<Text>().text = c.projectName;
                
            }
            
        }
        else
            print("projectList empty");
		
	}
	
}
