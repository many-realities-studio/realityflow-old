using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.Serialization.Json;
using System.Text;
using System.Threading.Tasks;

namespace Packages.realityflow_package.Runtime.scripts.Messages
{
    /// <summary>
    /// The purpose of this class is to provide utility functions to allow for easy serializing and
    /// de-serializing of <see cref="BaseMessage"/> objects.
    /// Note that any new message classes created must contain the [DataContract] tag,
    /// and that each property that you want to serialize must be tagged as a [DataMember].
    /// You cannot serialize fields.
    /// </summary>
    public static class MessageSerializer
    {
        /// <summary>
        /// Gets all classes that inherit from <see cref="BaseMessage"/>
        /// <Found from: https://stackoverflow.com/questions/857705/get-all-derived-types-of-a-type
        /// </summary>
        private static Type[] messageTypes = (
                    from domainAssembly in AppDomain.CurrentDomain.GetAssemblies()
                    from assemblyType in domainAssembly.GetTypes()
                    where typeof(BaseMessage).IsAssignableFrom(assemblyType)
                    && !assemblyType.IsAbstract
                    select assemblyType).ToArray();

        /// <summary>
        /// Handles serialization and de-serialization of classes that inherit from <see cref="BaseMessage"/>
        /// </summary>
        private static DataContractJsonSerializer JsonSerializer = new DataContractJsonSerializer(typeof(Messages.BaseMessage), messageTypes);

        /// <summary>
        /// 
        /// </summary>
        /// <typeparam name="T">The type of message you are trying to serialize</typeparam>
        /// <param name="messageToSerialize">The message object that you want to serialize</param>
        /// <returns></returns>
        public static MemoryStream SerializeMessage<T>(T messageToSerialize) where T : BaseMessage
        {
            MemoryStream memoryStream = new MemoryStream();

            JsonSerializer.WriteObject(memoryStream, messageToSerialize);

            memoryStream.Position = 0;

            return memoryStream;
        }

        public static T DesearializeObject<T>(string messageToDeserialize) where T : BaseMessage
        {
            MemoryStream memoryStream = new MemoryStream(Encoding.UTF8.GetBytes(messageToDeserialize));
            memoryStream.Position = 0;

            return (T)JsonSerializer.ReadObject(memoryStream);
        }
    }
}
