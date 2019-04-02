using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class LoadPage : MonoBehaviour {

    public void loadLevel(string sceneName)
    {
        SceneManager.LoadScene (sceneName) ;
    }
        
}
