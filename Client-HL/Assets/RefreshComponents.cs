using UnityEngine;
using TMPro;

public class RefreshComponents : MonoBehaviour
{
    [SerializeField]
    public TextMeshProUGUI user;
    [SerializeField]
    public TextMeshProUGUI pw;

    private void OnDisable()
    {
        user.text = "user";
        pw.text = "pass";
    }
}
