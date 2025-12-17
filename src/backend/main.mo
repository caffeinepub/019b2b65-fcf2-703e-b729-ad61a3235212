import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Order "mo:core/Order";

actor {
  type Pin = {
    latitude : Float;
    longitude : Float;
    memo : Text;
  };

  module Pin {
    public func compare(x : Pin, y : Pin) : Order.Order {
      if (x.latitude == y.latitude) {
        if (x.longitude == y.longitude) {
          #equal;
        } else if (x.longitude < y.longitude) {
          #less;
        } else {
          #greater;
        };
      } else if (x.latitude < y.latitude) {
        #less;
      } else {
        #greater;
      };
    };
  };

  var pinIdCounter = 0;
  let pins = Map.empty<Nat, Pin>();

  public shared ({ caller }) func createPin(latitude : Float, longitude : Float, memo : Text) : async Nat {
    let pin : Pin = {
      latitude;
      longitude;
      memo;
    };

    let pinId = pinIdCounter;
    pins.add(pinId, pin);
    pinIdCounter += 1;
    pinId;
  };

  public query ({ caller }) func getPin(pinId : Nat) : async Pin {
    switch (pins.get(pinId)) {
      case (null) { Runtime.trap("Pin not found") };
      case (?pin) { pin };
    };
  };

  public query ({ caller }) func getAllPins() : async [(Nat, Pin)] {
    pins.toArray();
  };

  public query ({ caller }) func getPinsByLocationRange(latMin : Float, latMax : Float, longMin : Float, longMax : Float) : async [(Nat, Pin)] {
    pins.toArray().filter(
      func(( _, pin)) {
        pin.latitude >= latMin and pin.latitude <= latMax and pin.longitude >= longMin and pin.longitude <= longMax
      }
    );
  };
};
