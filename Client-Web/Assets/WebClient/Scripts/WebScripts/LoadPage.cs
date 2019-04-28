using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UI;
using Assets.RealityFlow.Scripts.Events;

public class LoadPage : MonoBehaviour
{
    public Text username;
    public Text password;
    private string sceneToLoad;

    IEnumerator waitFunction()
    {
        //replace count with actual server response
        int count = 0;
        while (!Config.loggedIn)
        {
            if (count > 20)
                yield break;
            count++;
            print("Waiting for server resposne...");
            yield return new WaitForSeconds(1);
        }
        SceneManager.LoadScene(sceneToLoad);

    }

    public void loadLevel(string sceneName)
    {
        sceneToLoad = sceneName;
        UserLoginEvent login = new UserLoginEvent();
        login.Send(username.text, password.text);

        StartCoroutine(waitFunction());
    }

    public void exitLevel(string sceneName)
    {
        UserLogoutEvent logOut = new UserLogoutEvent();
        logOut.Send();
        SceneManager.LoadScene(sceneName);
    }


}
