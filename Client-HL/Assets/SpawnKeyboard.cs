using UnityEngine;
using TMPro;

public class SpawnKeyboard : MonoBehaviour
{
    public TouchScreenKeyboard keyboard;
    [SerializeField]
    private TextMeshProUGUI keyboardText;

    private GameObject currentlyActive;

    public void OpenSystemKeyboard()
    {
        currentlyActive = gameObject;
        keyboard = TouchScreenKeyboard.Open("", TouchScreenKeyboardType.Default, false, false, false, false);
    }

    private void Update()
    {
        if (keyboard != null && currentlyActive == gameObject)
        {
            keyboardText.text = keyboard.text;
            // Do stuff with keyboardText
        }
    }
}
