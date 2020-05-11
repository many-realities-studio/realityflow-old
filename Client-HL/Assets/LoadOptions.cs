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
        GameObject Pig = Instantiate(Resources.Load("Pig", typeof(GameObject)) as GameObject);
        GameObject Cow = Instantiate(Resources.Load("Cow", typeof(GameObject)) as GameObject);
        GameObject SheepWhite = Instantiate(Resources.Load("SheepWhite", typeof(GameObject)) as GameObject);
        GameObject ChickenBrown = Instantiate(Resources.Load("ChickenBrown", typeof(GameObject)) as GameObject);
        GameObject DuckWhite = Instantiate(Resources.Load("DuckWhite", typeof(GameObject)) as GameObject);


        DuckWhite.name = "DuckWhite";
        DuckWhite.transform.SetParent(PrefabOptions.transform);
        DuckWhite.transform.localScale = new Vector3(4, 4, 4);
        DuckWhite.transform.localPosition = new Vector3(0, -12, 0);
        var ltop = cube.AddComponent<ListenToPointer>();
        FindObjectOfType<NetworkManagerHL>().InitializeGameObject(cube);
        ltop.Initialize();

        ChickenBrown.name = "ChickenBrown";
        ChickenBrown.transform.SetParent(PrefabOptions.transform);
        ChickenBrown.transform.localScale = new Vector3(3, 3, 3);
        ChickenBrown.transform.localPosition = new Vector3(-4, 4, 0);
        ltop = ChickenBrown.AddComponent<ListenToPointer>();
        FindObjectOfType<NetworkManagerHL>().InitializeGameObject(ChickenBrown);
        ltop.Initialize();

        SheepWhite.name = "SheepWhite";
        SheepWhite.transform.SetParent(PrefabOptions.transform);
        SheepWhite.transform.localScale = new Vector3(3, 3, 3);
        SheepWhite.transform.localPosition = new Vector3(-4, 0, 0);
        ltop = SheepWhite.AddComponent<ListenToPointer>();
        FindObjectOfType<NetworkManagerHL>().InitializeGameObject(SheepWhite);
        ltop.Initialize();

        Cow.name = "Cow";
        Cow.transform.SetParent(PrefabOptions.transform);
        Cow.transform.localScale = new Vector3(3, 3, 3);
        Cow.transform.localPosition = new Vector3(-4, -4, 0);
        ltop = Cow.AddComponent<ListenToPointer>();
        FindObjectOfType<NetworkManagerHL>().InitializeGameObject(Cow);
        ltop.Initialize();

        Pig.name = "Pig";
        Pig.transform.SetParent(PrefabOptions.transform);
        Pig.transform.localScale = new Vector3(3, 3, 3);
        Pig.transform.localPosition = new Vector3(-4, -8, 0);
        ltop = Pig.AddComponent<ListenToPointer>();
        FindObjectOfType<NetworkManagerHL>().InitializeGameObject(Pig);
        ltop.Initialize();

        cube.name = "cube";
        cube.transform.SetParent(PrefabOptions.transform);
        cube.transform.localPosition = new Vector3(0, 4, 0);
        cube.transform.localScale = new Vector3(3, 3, 3);
        ltop = cube.AddComponent<ListenToPointer>();
        FindObjectOfType<NetworkManagerHL>().InitializeGameObject(cube);
        ltop.Initialize();


        sphere.name = "sphere";
        sphere.transform.SetParent(PrefabOptions.transform);
        sphere.transform.localPosition = Vector3.zero;
        sphere.transform.localScale = new Vector3(3, 3, 3);
        ltop = sphere.AddComponent<ListenToPointer>();
        FindObjectOfType<NetworkManagerHL>().InitializeGameObject(sphere);
        ltop.Initialize();

        capsule.name = "capsule";
        capsule.transform.SetParent(PrefabOptions.transform);
        capsule.transform.localPosition = new Vector3(0, -4, 0);
        capsule.transform.localScale = new Vector3(3, 3, 3);
        ltop = capsule.AddComponent<ListenToPointer>();
        FindObjectOfType<NetworkManagerHL>().InitializeGameObject(capsule);
        ltop.Initialize();


    }

}
