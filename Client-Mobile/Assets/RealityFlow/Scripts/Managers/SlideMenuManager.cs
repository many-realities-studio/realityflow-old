using MobileConfiguration;
using Packages.realityflow_package.Runtime.scripts;
using RealityFlow.Plugin.Scripts;
using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using Config = MobileConfiguration.Config;

public class SlideMenuManager : MonoBehaviour
{
    public Button checkOutButton;
    public Button checkInButton;
    public const int numberOfButtons = 6;

    public Text objectToDeleteText;
    
    public Button[] objectEditorButtons = new Button[numberOfButtons];

    List<string> currentCheckoutObjects = new List<string>();


    /// <summary>
    /// Activates the slide menu buttons if the selected object is checked out, leaves them disabled if object is not checked out.
    /// </summary>
    /// <param name="status"></param>
    public void ToggleMenuButtons(bool status)
    {
        // An object is selected
        if(Config.CurrentSelectedObjectId != null)
        {
            // if the user has the object checked out, then toggle alll object editing buttons
            if (currentCheckoutObjects.Contains(Config.CurrentSelectedObjectId))
            {
                ToggleEditingButtons(true);
            }

            else
            {
                ToggleEditingButtons(false);
            }
        }

        // No object is selected
        else
        {
            ToggleAllButtonsInMenu(false);
        }
    }


    /// <summary>
    /// Activates every button in the slide menu
    /// </summary>
    /// <param name="visible"></param>
    public void ToggleAllButtonsInMenu(Boolean visible)
    {
        foreach (Transform child in transform)
        {
            child.GetComponent<Selectable>().interactable = visible;
        }
    }



    /// <summary>
    /// Activates the objecet editing buttons in the slide menu manager 
    /// </summary>
    /// <param name="visible"></param>
    public void ToggleEditingButtons(Boolean visible)
    {
        checkOutButton.GetComponent<Selectable>().interactable = !visible;
        checkInButton.GetComponent<Selectable>().interactable = visible;

        // Turn on all object editing buttons
        foreach (Button b in objectEditorButtons)
        {
            b.GetComponent<Selectable>().interactable = visible;
        }
    }


    
    /// <summary>
    /// Sends a request to the server to checkout the current selected object
    /// </summary>
    public void CheckOutObject()
    {
        Operations.CheckoutObject(Config.CurrentSelectedObjectId, ConfigurationSingleton.SingleInstance.CurrentProject.Id, (_, e) =>
        {

            if(e.message.WasSuccessful)
            {
                FlowTObject checkedOutObject = FlowTObject.idToGameObjectMapping[e.message.ObjectID];
                Debug.Log("Checking out " + checkedOutObject.Name);
                checkedOutObject.CanBeModified = true;
                currentCheckoutObjects.Add(e.message.ObjectID);
                ToggleEditingButtons(true);
            }

            else
            {
                FlowTObject.idToGameObjectMapping[e.message.ObjectID].CanBeModified = false;
            }
        });
    }



    /// <summary>
    /// Sends a request to the server to check an object back in
    /// </summary>
    public void CheckInObject()
    {
        Operations.CheckinObject(Config.CurrentSelectedObjectId, ConfigurationSingleton.SingleInstance.CurrentProject.Id, ConfigurationSingleton.SingleInstance.CurrentUser.Username, (_, e) =>
        {
            if (e.message.WasSuccessful)
            {
                FlowTObject checkedInObject = FlowTObject.idToGameObjectMapping[e.message.ObjectID];
                Debug.Log("Checking in " + checkedInObject.Name);
                checkedInObject.CanBeModified = false;
                currentCheckoutObjects.Remove(e.message.ObjectID);
                ToggleEditingButtons(false);

            }
            else
            {
                FlowTObject.idToGameObjectMapping[e.message.ObjectID].CanBeModified = true;
                
            }
        });
    }



    /// <summary>
    /// Deletes the current selected object when trying to delete object from the slide menu.
    /// Then it removes it from the list of current checked out 
    /// objects
    /// </summary>
    public void DeleteObjectFromSlideMenu()
    {
        if(Config.CurrentSelectedObjectId != null)
        {
            Operations.DeleteObject(Config.CurrentSelectedObjectId, ConfigurationSingleton.SingleInstance.CurrentProject.Id, (_, e) =>
            {
                if(e.message.WasSuccessful)
                {
                    Debug.Log("Object was deleted");
                    ToggleAllButtonsInMenu(false);
                    currentCheckoutObjects.Remove(e.message.DeletedObjectId);
                }
            });
        }
    }



    /// <summary>
    /// Populates the current selected object's name for the delete confirmation popup
    /// </summary>
    public void PopulateDeleteConfirmationText()
    {
        if(Config.CurrentSelectedObjectId != null)
        {
            string objectName = FlowTObject.idToGameObjectMapping[Config.CurrentSelectedObjectId].Name;
            objectToDeleteText.text = "Are you sure you want to delete " + objectName + "?";
        }
    }

    public void UpdateObjectFromSlideMenu()
    {
        if(Config.CurrentSelectedObjectId != null)
        {
            if (FlowTObject.idToGameObjectMapping[Config.CurrentSelectedObjectId].CanBeModified == true)
            {
                Operations.UpdateObject(FlowTObject.idToGameObjectMapping[Config.CurrentSelectedObjectId], ConfigurationSingleton.SingleInstance.CurrentUser, ConfigurationSingleton.SingleInstance.CurrentProject.Id, ConfigurationSingleton.SingleInstance.CurrentUser.Username, (_, e) => {/* Debug.Log(e.message);*/ });
            }
        }

        
    }
}
