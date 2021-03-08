using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using GraphProcessor;
using System.Linq;
using NodeGraphProcessor.Examples;
using UnityEngine.Rendering;

[System.Serializable, NodeMenuItem("Primitives/Bool")]
public class BoolNode : BaseNode
{
	[Input(name = "Value")]
    public static bool value;

    public bool output;
    public bool input;

	[Output(name = "True")]
	public ConditionalLink	@true;
	[Output(name = "False")]
	public ConditionalLink	@false;
    string fieldName = value ? nameof(@true) : nameof(@false);
	public override string		name => "Bool";

    protected override void Process() => output = input;

    public bool getValue()
    {
        return value;
    }
}