export const GetCustomerInfo = /*GraphQL*/ `
    query GetCustomerInfo {
        GetCustomerInfo
        @rest(
          path: "/GetCustomerInfo"
          method: "GET"
          endpoint: "customerPortal"
        ) {
            status
            statusdescription
            Service
            Caller
            CallerPhone
            CallerEmail
            PName
            PAddress
            PCity
            PState
            PZip
            PCountry
            PRoom
            PSee
            PPhone
            PNote
            DName
            DAddress
            DCity
            DState
            DZip
            DCountry
            DRoom
            DSee
            DPhone
            DNote
            Description
            Pieces
            Weight
            DeclaredValue
            PackageTypeID
            Notes
            VehicleTypeID
            CustomerID
            NotifyMeEmail
            NotifyMeWhen
            NotifyRecipientEmail
            NotifyRecipientWhen
            Notify3rdPartyEmail
            Notify3rdPartyWhen
            BillingType
            PResidence
            DResidence
            PCustomerShipToCode
            PAddToAddress
            DAddToAddress
            DCustomerShipToCode
            CallerLookup
            RemotePieceDetail
            reqDRoom
            reqDSee
            reqDPhone
            DisableOrderEntry
            RemotePickupPrompt
            admin
            RequirePieceType
            ScaleMachine
            ScaleDevice
            DueTimeEntry
            ReadyTimeUnassigned
            RemotePieceContainer
            OrderReferences {
                Reference
                BLAlias
                Other
                Invoice
            }
            VehicleTypes {
                VehicleValue
                VehicleName
            }
            ServiceTypes {
                ServiceValue
                ServiceName
            }
            PackageTypes {
                PackageValue
                PackageName
            }
            NotifyEvents {
                NotifyValue
                NotifyName
            }
        }
    }
`;
