using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class LoadOptions : MonoBehaviour
{
    public GameObject PrefabOptions;

    public void Awake()
    {
        LoadPrefabs();
    }

    public void LoadPrefabs()
    {
        GameObject cube = Instantiate(Resources.Load("cube", typeof(GameObject)) as GameObject);
        GameObject sphere = Instantiate(Resources.Load("sphere", typeof(GameObject)) as GameObject);
        GameObject capsule = Instantiate(Resources.Load("capsule", typeof(GameObject)) as GameObject);

        cube.name = "cube";
        cube.transform.SetParent(PrefabOptions.transform);
        cube.transform.localScale = new Vector3(.25f, .25f, .25f);
        cube.transform.localPosition = new Vector3(0, .4f, 0);
        cube.AddComponent<ListenToPointer>();

        sphere.name = "sphere";
        sphere.transform.SetParent(PrefabOptions.transform);
        sphere.transform.localPosition = Vector3.zero;
        sphere.transform.localScale = new Vector3(.25f, .25f, .25f);
        cube.AddComponent<ListenToPointer>();

        capsule.name = "capsule";
        capsule.transform.SetParent(PrefabOptions.transform);
        cube.transform.localPosition = new Vector3(0, -.4f, 0);
        capsule.transform.localScale = new Vector3(.25f, .25f, .25f);
        cube.AddComponent<ListenToPointer>();
    }

}
